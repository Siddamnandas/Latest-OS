import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface MediaValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

interface UseMediaUploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string, canRetry: boolean) => void;
  onProgress?: (progress: UploadProgress) => void;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxDuration?: number; // for video/audio in seconds
}

interface UseMediaUploadReturn {
  uploadFile: (file: Blob, url: string, formData: Record<string, any>) => Promise<boolean>;
  validateMedia: (file: Blob) => Promise<MediaValidationResult>;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  lastError: string | null;
}

const MEDIA_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_AUDIO_TYPES: ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg'],
  MAX_VIDEO_DURATION: 300, // 5 minutes
  MAX_AUDIO_DURATION: 600, // 10 minutes
};

export function useMediaUpload(options: UseMediaUploadOptions = {}): UseMediaUploadReturn {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const validateMedia = useCallback(async (file: Blob): Promise<MediaValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Size validation
    const maxSize = options.maxSize ?? MEDIA_CONSTANTS.MAX_SIZE;
    if (file.size > maxSize) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }

    // Type validation
    const allowedTypes = options.allowedTypes ?? [
      ...MEDIA_CONSTANTS.ALLOWED_IMAGE_TYPES,
      ...MEDIA_CONSTANTS.ALLOWED_VIDEO_TYPES,
      ...MEDIA_CONSTANTS.ALLOWED_AUDIO_TYPES,
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Duration validation for video and audio
    if ((file.type.startsWith('video/') || file.type.startsWith('audio/')) && file instanceof File) {
      try {
        const duration = await getMediaDuration(file);
        const maxDuration = file.type.startsWith('video/')
          ? (options.maxDuration ?? MEDIA_CONSTANTS.MAX_VIDEO_DURATION)
          : (options.maxDuration ?? MEDIA_CONSTANTS.MAX_AUDIO_DURATION);

        if (duration > maxDuration) {
          warnings.push(`Media duration (${duration}s) is longer than recommended (${maxDuration}s). Upload may take longer.`);
        }
      } catch (error) {
        warnings.push('Could not verify media duration, but upload should still work');
      }
    }

    // File integrity check
    if (file.size === 0) {
      errors.push('File appears to be empty');
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }, [options]);

  const uploadFile = useCallback(async (
    file: Blob,
    url: string,
    formData: Record<string, any>
  ): Promise<boolean> => {
    setIsUploading(true);
    setLastError(null);
    setUploadProgress(null);

    try {
      // Validate the media first
      const validation = await validateMedia(file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Media validation failed');
      }

      // Show validation warnings if any
      if (validation.warnings && validation.warnings.length > 0) {
        toast({
          title: "Upload Notice",
          description: validation.warnings.join('; '),
          duration: 5000,
        });
      }

      // Prepare form data
      const data = new FormData();

      // Add the file with a proper name
      const fileExtension = getFileExtension(file.type);
      const fileName = `memory.${fileExtension}`;
      data.append('file', file, fileName);

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, String(value));
        }
      });

      // Create upload request
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          setUploadProgress(progress);
          options.onProgress?.(progress);
        }
      };

      // Set up completion handler
      const uploadPromise = new Promise<boolean>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);

              // Success callback
              if (options.onSuccess) {
                options.onSuccess(response);
              }

              resolve(true);
            } catch (error) {
              reject(new Error('Invalid response format from server'));
            }
          } else {
            // Try to parse error response
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error occurred during upload'));
        };

        xhr.ontimeout = () => {
          reject(new Error('Upload timed out'));
        };
      });

      // Start the upload
      xhr.open('POST', url);
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(data);

      // Wait for completion
      const success = await uploadPromise;

      // Clear progress on success
      setUploadProgress(null);
      setIsUploading(false);

      return success;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setLastError(errorMessage);
      setIsUploading(false);
      setUploadProgress(null);

      // Error callback - determine if retry is possible
      const canRetry = !errorMessage.includes('size') && !errorMessage.includes('type') && !errorMessage.includes('empty');

      if (options.onError) {
        options.onError(errorMessage, canRetry);
      } else {
        toast({
          title: "Upload Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      }

      return false;
    }
  }, [validateMedia, toast, options]);

  return {
    uploadFile,
    validateMedia,
    uploadProgress,
    isUploading,
    lastError,
  };
}

// Helper function to get media duration
async function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');

    media.preload = 'metadata';

    media.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(media.duration);
    };

    media.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load media metadata'));
    };

    media.src = url;
  });
}

// Helper function to get file extension from MIME type
function getFileExtension(mimeType: string): string {
  const extensions = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'audio/wav': 'wav',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
  };

  return extensions[mimeType as keyof typeof extensions] || 'bin';
}
