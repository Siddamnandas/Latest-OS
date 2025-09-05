import { useState, useEffect, useCallback } from 'react';

type StorageValue<T> = T | null;
type StorageSetter<T> = (value: T | ((prev: StorageValue<T>) => T)) => void;

/**
 * Custom hook for local storage with type safety and error handling
 * Implements draft recovery functionality for MemoryRecorder
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    expiry?: number; // Time in ms after which to expire
  } = {}
): [StorageValue<T>, StorageSetter<T>, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    expiry,
  } = options;

  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<StorageValue<T>>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      const parsed = deserialize(item);

      // Check expiration if expiry option is provided
      if (expiry && typeof parsed === 'object' && parsed !== null && 'expiry' in parsed && '_value' in parsed) {
        if (Date.now() > parsed.expiry) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
        return parsed._value;
      }

      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Persist value to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (storedValue === null || storedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        const valueToStore = expiry
          ? { _value: storedValue, expiry: Date.now() + expiry }
          : storedValue;

        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, serialize, expiry]);

  // Setter function
  const setValue: StorageSetter<T> = useCallback((value) => {
    try {
      const valueToStore = typeof value === 'function'
        ? (value as (prev: StorageValue<T>) => T)(storedValue)
        : value;

      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`Error setting value for localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove function
  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Specific hook for memory drafts
export interface MemoryDraft {
  title: string;
  description: string;
  content: string;
  tags: string[];
  mediaType: 'text' | 'audio' | 'video' | 'image';
  mediaData?: string; // Base64 encoded media
  mediaTypeStr?: string; // MIME type
  timestamp: number;
}

export function useMemoryDrafts() {
  const [drafts, setDrafts] = useLocalStorage<Record<string, MemoryDraft>>(
    'memory_drafts',
    {},
    {
      expiry: 24 * 60 * 60 * 1000, // 24 hours
    }
  );

  const saveDraft = useCallback((id: string, draft: Omit<MemoryDraft, 'timestamp'>) => {
    setDrafts(prev => ({
      ...prev,
      [id]: {
        ...draft,
        timestamp: Date.now(),
      },
    }));
  }, [setDrafts]);

  const loadDraft = useCallback((id: string): MemoryDraft | null => {
    return drafts?.[id] || null;
  }, [drafts]);

  const deleteDraft = useCallback((id: string) => {
    setDrafts(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[id];
      return newDrafts;
    });
  }, [setDrafts]);

  const listDrafts = useCallback((): MemoryDraft[] => {
    if (!drafts) return [];

    return Object.entries(drafts)
      .map(([id, draft]) => ({ ...draft, id }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [drafts]);

  const clearExpiredDrafts = useCallback(() => {
    const now = Date.now();
    const expiry = 7 * 24 * 60 * 60 * 1000; // 7 days

    setDrafts(prev => {
      if (!prev) return {};

      const newDrafts: Record<string, MemoryDraft> = {};

      Object.entries(prev).forEach(([id, draft]) => {
        if (now - draft.timestamp < expiry) {
          newDrafts[id] = draft;
        }
      });

      return newDrafts;
    });
  }, [setDrafts]);

  const hasDrafts = listDrafts().length > 0;

  const getPreview = useCallback((draft: MemoryDraft): string => {
    if (draft.content) {
      return draft.content.substring(0, 100) + (draft.content.length > 100 ? '...' : '');
    }

    if (draft.mediaType !== 'text') {
      return `Media memory (${draft.mediaType})`;
    }

    return draft.title || 'Untitled draft';
  }, []);

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    listDrafts,
    clearExpiredDrafts,
    hasDrafts,
    getPreview,
  };
}

// Generic hook for memory recovery state
export interface RecoveryState {
  isRecovering: boolean;
  recoveredMemory?: Partial<MemoryDraft>;
  canRecover: boolean;
}

export function useMemoryRecovery() {
  const { loadDraft, deleteDraft, hasDrafts, saveDraft } = useMemoryDrafts();

  const recoverFromBrowser = useCallback((
    onRecover: (recovered: MemoryDraft) => void,
    onError?: (error: string) => void
  ) => {
    try {
      // Look for the most recent draft in localStorage
      const draftsStr = localStorage.getItem('memory_drafts');
      if (!draftsStr) {
        onError?.('No drafts found');
        return;
      }

      const drafts: Record<string, MemoryDraft> = JSON.parse(draftsStr);
      const recent = Object.values(drafts).sort((a, b) => b.timestamp - a.timestamp)[0];

      if (!recent) {
        onError?.('No drafts found');
        return;
      }

      // Check if draft is recent (within last 24 hours)
      const isRecent = Date.now() - recent.timestamp < 24 * 60 * 60 * 1000;

      if (!isRecent) {
        onError?.('Draft is too old to recover');
        return;
      }

      onRecover(recent);
    } catch (error) {
      console.warn('Error recovering memory:', error);
      onError?.('Failed to recover draft');
    }
  }, []);

  const saveForRecovery = useCallback((
    memory: {
      title: string;
      description: string;
      content: string;
      tags: string[];
      mediaType: string;
      mediaBlob?: Blob;
    },
    draftId: string = 'current'
  ) => {
    try {
      // Convert media blob to base64 for storage
      let mediaPromise: Promise<string> | null = null;

      if (memory.mediaBlob instanceof Blob) {
        mediaPromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(memory.mediaBlob);
        });
      }

      const handleSave = (mediaData?: string) => {
        const draft: MemoryDraft = {
          title: memory.title,
          description: memory.description,
          content: memory.content,
          tags: memory.tags,
          mediaType: memory.mediaType as any,
          mediaData: mediaData || undefined,
          mediaTypeStr: memory.mediaBlob?.type,
          timestamp: Date.now(),
        };

        saveDraft(draftId, draft);
      };

      if (mediaPromise) {
        mediaPromise.then(handleSave);
      } else {
        handleSave();
      }

    } catch (error) {
      console.warn('Error saving for recovery:', error);
    }
  }, [saveDraft]);

  return {
    recoverFromBrowser,
    saveForRecovery,
    hasDrafts,
  };
}
