// Cross-platform storage wrapper using IndexedDB on web and AsyncStorage on native

export interface StorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const DB_NAME = 'leelaos-store';
const STORE_NAME = 'keyval';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function idbRemove(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

let adapter: StorageAdapter;

if (typeof window !== 'undefined' && 'indexedDB' in window) {
  adapter = {
    getItem: idbGet,
    setItem: idbSet,
    removeItem: idbRemove,
  };
} else {
  // Fallback for server-side rendering or environments without IndexedDB
  adapter = {
    async getItem<T>(key: string): Promise<T | null> {
      // Return null for server-side rendering
      return null;
    },
    async setItem<T>(key: string, value: T): Promise<void> {
      // No-op for server-side rendering
    },
    async removeItem(key: string): Promise<void> {
      // No-op for server-side rendering
    },
  };
}

const THEME_KEY = 'theme';

export async function getTheme(): Promise<'light' | 'dark' | null> {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(THEME_KEY);
    if (local === 'light' || local === 'dark') {
      return local;
    }
  }
  return adapter.getItem<'light' | 'dark'>(THEME_KEY);
}

export async function setTheme(theme: 'light' | 'dark'): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
  }
  await adapter.setItem(THEME_KEY, theme);
}

export async function toggleTheme(): Promise<'light' | 'dark'> {
  const current = await getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  await setTheme(next);
  return next;
}

export default adapter;

