import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'AppCacheDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Crear object stores si no existen
        if (!db.objectStoreNames.contains('keyValueStore')) {
          db.createObjectStore('keyValueStore', { keyPath: 'key' });
        }
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'userId' });
        }
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('Error al abrir IndexedDB:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private async ensureDBReady(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initializeDB();
    }
    return this.db!;
  }

  // Métodos genéricos
  async setData(key: string, value: unknown): Promise<void> {
    const db = await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('keyValueStore', 'readwrite');
      const store = transaction.objectStore('keyValueStore');
      
      const request = store.put({ key, value });
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async getData<T = unknown>(key: string): Promise<T | null> {
    const db = await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('keyValueStore', 'readonly');
      const store = transaction.objectStore('keyValueStore');
      
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async deleteData(key: string): Promise<void> {
    const db = await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('keyValueStore', 'readwrite');
      const store = transaction.objectStore('keyValueStore');
      
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }

  async deleteAll(): Promise<void> {
    const db = await this.ensureDBReady();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['keyValueStore', 'users', 'profiles'], 'readwrite');
      
      transaction.objectStore('keyValueStore').clear();
      transaction.objectStore('users').clear();
      transaction.objectStore('profiles').clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject((event.target as IDBRequest).error);
    });
  }
}
