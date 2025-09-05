// Web Worker for Media Upload Processing
// This prevents main thread blocking during large uploads

interface UploadMessage {
  id: string;
  action: 'UPLOAD_CHUNK' | 'UPLOAD_COMPLETE' | 'CANCEL_UPLOAD' | 'VALIDATE_MEDIA';
  data?: {
    file?: File;
    chunkIndex?: number;
    totalChunks?: number;
    url?: string;
    formData?: Record<string, any>;
  };
}

interface UploadResponse {
  id: string;
  success: boolean;
  progress: number;
  error?: string;
  data?: any;
  retryable?: boolean;
}

const chunkSize = 1024 * 512; // 512KB chunks (matches MEDIA_CONSTANTS.CHUNK_SIZE)

// Upload progress cache
const uploadStates = new Map<string, {
  controller: AbortController;
  startTime: number;
  lastProgress: number;
}>();

function validateMedia(data: { file: File }): { valid: boolean; error?: string } {
  // Validate file size
  if (data.file.size > 100 * 1024 * 1024) { // 100MB
    return { valid: false, error: 'File too large (>100MB)' };
  }

  // Validate file type
  const allowedTypes = ['audio/wav', 'audio/mp3', 'video/webm', 'video/mp4', 'image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(data.file.type)) {
    return { valid: false, error: 'Unsupported file type' };
  }

  // Basic integrity check - try creating object URL
  try {
    URL.createObjectURL(data.file);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Corrupted media file' };
  }
}

function uploadChunk(url: string, formData: FormData, uploadId: string): Promise<Response> {
  const state = uploadStates.get(uploadId);
  if (!state) {
    throw new Error('Upload state not found');
  }

  return fetch(url, {
    method: 'POST',
    body: formData,
    signal: state.controller.signal,
    headers: {
      // Let browser set content-type for multipart/form-data
      'Upload-Id': uploadId,
    },
  });
}

function postMessage(response: UploadResponse) {
  (self as any).postMessage(response);
}

self.addEventListener('message', async (event: MessageEvent<UploadMessage>) => {
  const { id, action, data } = event.data;
  const uploadId = id;

  switch (action) {
    case 'VALIDATE_MEDIA': {
      if (!data?.file) {
        postMessage({
          id,
          success: false,
          progress: 0,
          error: 'No file provided for validation',
        });
        return;
      }

      const validation = validateMedia({ file: data.file });

      postMessage({
        id,
        success: validation.valid,
        progress: 100,
        error: validation.error,
      });
      break;
    }

    case 'UPLOAD_CHUNK': {
      if (!data?.file || !data?.url) {
        postMessage({
          id,
          success: false,
          progress: 0,
          error: 'Missing file or URL for upload',
        });
        return;
      }

      try {
        // Initialize upload state
        const controller = new AbortController();
        uploadStates.set(uploadId, {
          controller,
          startTime: Date.now(),
          lastProgress: 0,
        });

        const formData = new FormData();

        // Add provided form data
        if (data.formData) {
          Object.entries(data.formData).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          });
        }

        // If it's the original file (chunkIndex === 0), upload as single file
        // For simplicity, we'll handle chunking separately if needed
        formData.append('file', data.file);

        const response = await uploadChunk(data.url, formData, uploadId);

        // Clean up upload state
        uploadStates.delete(uploadId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        postMessage({
          id,
          success: true,
          progress: 100,
          data: result,
        });

      } catch (error) {
        // Clean up upload state
        uploadStates.delete(uploadId);

        const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
        const retryable = error instanceof Error &&
                         !error.name.includes('AbortError') &&
                         !errorMessage.includes('File too large');

        postMessage({
          id,
          success: false,
          progress: 0,
          error: errorMessage,
          retryable,
        });
      }
      break;
    }

    case 'CANCEL_UPLOAD': {
      const state = uploadStates.get(uploadId);
      if (state) {
        state.controller.abort();
        uploadStates.delete(uploadId);
      }

      postMessage({
        id,
        success: true,
        progress: 0,
        data: { cancelled: true },
      });
      break;
    }

    case 'UPLOAD_COMPLETE': {
      // Handle any cleanup needed
      uploadStates.delete(uploadId);

      postMessage({
        id,
        success: true,
        progress: 100,
        data: { completed: true },
      });
      break;
    }

    default: {
      postMessage({
        id,
        success: false,
        progress: 0,
        error: `Unknown action: ${action}`,
      });
    }
  }
});

// Heartbeat to keep worker alive
setInterval(() => {
  // Clean up stale upload states (older than 5 minutes)
  const now = Date.now();
  const maxAge = 5 * 60 * 1000;

  uploadStates.forEach((state, id) => {
    if (now - state.startTime > maxAge) {
      state.controller.abort();
      uploadStates.delete(id);
    }
  });
}, 60000); // Every minute
