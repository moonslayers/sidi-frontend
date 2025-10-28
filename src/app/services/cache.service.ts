import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_PREFIX = 'app_cache_';
  private readonly EXPIRATION_MINUTES = 2; // Tiempo de vida del caché
  // Guardar datos en caché con timestamp
  set(key: string, data: unknown): void {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(cacheData));
  }

  // Obtener datos del caché (retorna null si expiró)
  get<T>(key: string): T | null {
    const cachedItem = localStorage.getItem(`${this.CACHE_PREFIX}${key}`);
    if (!cachedItem) return null;

    const parsedData = JSON.parse(cachedItem);
    const currentTime = new Date().getTime();
    const expirationTime = this.EXPIRATION_MINUTES * 60 * 1000; // 3 minutos en milisegundos

    // Verificar si el caché expiró
    if (currentTime - parsedData.timestamp > expirationTime) {
      this.remove(key); // Eliminar si expiró
      return null;
    }

    return parsedData.data as T;
  }

  // Eliminar un elemento del caché
  remove(key: string): void {
    localStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
  }

  // Limpiar todo el caché de la app
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}
