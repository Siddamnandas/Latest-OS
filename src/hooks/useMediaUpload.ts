import { useState, useRef, useCallback, useEffect } from 'react';
import { MEDIA_CONSTANTS, MEDIA_ERROR_CODES, MEDIA_MESSAGES } from '@/lib/config';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  retryCount: number;
  uploadId: string | null;
  canRetry: boolean;
}

interface UseMediaUploadOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string, canRetry: boolean) => void;
  onProgress?: (progress: number) => void;
}

export function useMediaUpload(options: UseMediaUploadOptions = {}) {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    retryCount: 0,
    uploadId: null,
    canRetry: false,
  });

  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Initialize worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker('/workers/media-worker.js');

      workerRef.current.onmessage = (event) => {
        const { id, success, progress, error, data, retryable } = event.data;

        // Only handle messages for our current upload
        if (id !== state.uploadId) return;

        if (success) {
          if (progress >= 100) {
            setState(prev => ({
              ...prev,
              isUploading: false,
              progress: 100,
              error: null,
            }));

            if (options.onSuccess && data) {
              options.onSuccess(data);
            }
          } else {
            setState(prev => ({
              ...prev,
              progress: Math.max(prev.progress, progress),
            }));

            if (options.onProgress) {
              options.onProgress(progress);
            }
          }
        } else {
          // Handle error with retry logic
          const canRetry = retryable && state.retryCount < 3;

          setState(prev => ({
            ...prev,
            isUploading: false,
            error: error || MEDIA_MESSAGES.ERROR.DEFAULT,
            canRetry,
          }));

          if (options.onError) {
            options.onError(error || MEDIA_MESSAGES.ERROR.DEFAULT, canRetry);
          }

          // Auto-retry if applicable
          if (canRetry && state.retryCount < 3) {
            scheduleRetry();
          }
        }
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }

        // Clean up timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
        retryTimeouts.current = [];
      };
    }

    return undefined;
  }, [state.uploadId, state.retryCount, options]);

  const scheduleRetry = useCallback(() => {
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, state.retryCount) * 1000;

    const timeout = setTimeout(() => {
      setState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        error: null,
      }));

      // Retry the last upload - this will need to be implemented based on stored state
      console.log(`Retrying upload attempt ${state.retryCount + 1}`);
    }, delay);

    retryTimeouts.current.push(timeout);
  }, [state.retryCount]);

  const validateMedia = useCallback(async (file: File | Blob): Promise<boolean> => {
    if (!workerRef.current) {
      console.warn('Worker not available');
      return false;
    }

    return new Promise((resolve) => {
      const id = `validate-${Date.now()}`;

      const handleValidation = (event: MessageEvent) => {
        const { id: responseId, success } = event.data;
        if (responseId === id && workerRef.current) {
          workerRef.current.removeEventListener('message', handleValidation);
          resolve(success);
        }
      };

      workerRef.current.addEventListener('message', handleValidation);

      // Convert Blob to File if needed for validation
      const validateFile = file instanceof Blob && !(file instanceof File)
        ? new File([file], 'temp-file', { type: file.type })
        : file;

      workerRef.current.postMessage({
        id,
        action: 'VALIDATE_MEDIA',
        data: { file: validateFile },
      });
    });
  }, []);

  const uploadFile = useCallback(async (
    file: File | Blob,
    url: string,
    formData: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!workerRef.current) {
      const error = MEDIA_MESSAGES.ERROR[MEDIA_ERROR_CODES.NETWORK_ERROR] || MEDIA_MESSAGES.ERROR.DEFAULT;
      setState(prev => ({ ...prev, error }));

      if (options.onError) {
        options.onError(error, false);
      }

      return false;
    }

    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null,
      uploadId,
      retryCount: 0,
      canRetry: false,
    }));

    // Set upload timeout
    timeoutRef.current = setTimeout(() => {
      if (workerRef.current && uploadId === state.uploadId) {
        workerRef.current.postMessage({
          id: uploadId,
          action: 'CANCEL_UPLOAD',
        });

        setState(prev => ({
          ...prev,
          isUploading: false,
          error: MEDIA_MESSAGES.ERROR[MEDIA_ERROR_CODES.UPLOAD_TIMEOUT] || MEDIA_MESSAGES.ERROR.DEFAULT,
          canRetry: true,
        }));
      }
    }, MEDIA_CONSTANTS.UPLOAD_TIMEOUT);

    // Convert Blob to File if needed for upload
    const uploadFileObj = file instanceof Blob && !(file instanceof File)
      ? new File([file], `memory-${Date.now()}`, { type: file.type })
      : file as File;

    // Send upload message to worker
    workerRef.current.postMessage({
      id: uploadId,
      action: 'UPLOAD_CHUNK',
      data: {
        file: uploadFileObj,
        url,
        formData,
      },
    });

    // Return promise for completion
    return new Promise((resolve) => {
      const handleUpload = (event: MessageEvent) => {
        const { id: responseId, success } = event.data;
        if (responseId === uploadId && workerRef.current) {
          workerRef.current.removeEventListener('message', handleUpload);

          // Clear timeout on completion
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          resolve(success);
        }
      };

      workerRef.current.addEventListener('message', handleUpload);
    });
  }, [state.uploadId, options]);

  const cancelUpload = useCallback(() => {
    if (workerRef.current && state.uploadId && state.isUploading) {
      workerRef.current.postMessage({
        id: state.uploadId,
        action: 'CANCEL_UPLOAD',
      });

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: 'Upload cancelled',
        uploadId: null,
      }));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [state.uploadId, state.isUploading, workerRef.current]);

  const retryUpload = useCallback(() => {
    // This would need to be implemented with stored state
    // For now, we'll just clear the error
    setState(prev => ({
      ...prev,
      error: null,
      canRetry: false,
    }));

    console.log('Retry upload not yet implemented - would need stored form data');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    // State
    ...state,

    // Actions
    validateMedia,
    uploadFile,
    cancelUpload,
    retryUpload,

    // Computed
    isIdle: !state.isUploading && !state.error,
    hasError: !!state.error,
  };
}
