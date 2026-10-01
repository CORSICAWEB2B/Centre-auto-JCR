// Utility for saving imported videos persistently in IndexedDB

const DB_NAME = 'CentreAutoJCR_VideoDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';
const KEY_NAME = 'imported_hero_video';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface SavedVideoData {
  blob: Blob;
  name: string;
  type: string;
  savedAt: number;
}

export async function saveVideoToIndexedDB(file: File | Blob, name?: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const data: SavedVideoData = {
        blob: file,
        name: name || (file instanceof File ? file.name : 'custom-video.mp4'),
        type: file.type || 'video/mp4',
        savedAt: Date.now(),
      };
      const request = store.put(data, KEY_NAME);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not save video to IndexedDB:', err);
  }
}

export async function loadSavedVideoFromIndexedDB(): Promise<SavedVideoData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY_NAME);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('Could not load video from IndexedDB:', err);
    return null;
  }
}

export async function clearSavedVideoFromIndexedDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(KEY_NAME);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Could not clear video from IndexedDB:', err);
  }
}
