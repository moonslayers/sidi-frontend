import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HashUtilsService {
    public generateArrayHash(dataSource: unknown[]=[]): string {
        if (!dataSource.length) return 'empty';

        // Estrategia optimizada: usar solo metadata crítico para evitar costo alto
        const criticalInfo = {
            length: dataSource.length,
            // Usar solo los primeros 3 elementos y últimos 2 para hash rápido
            firstElements: dataSource.slice(0, 3),
            lastElements: dataSource.slice(-2),
            // Incluir estructura de campos (primer elemento)
            fields: dataSource[0] ? Object.keys(dataSource[0]).sort().join(',') : 'no-fields'
        };

        const hashString = JSON.stringify(criticalInfo);
        return this.fnv1aHash(hashString);
    }

    public generateDataHash(value:unknown){
        return this.fnv1aHash(JSON.stringify(value))
    }

    // En TablaLocalService - FNV-1a hash (más simple y rápido)
    public fnv1aHash(str: string): string {
        let hash = 0x811c9dc5; // FNV offset basis

        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193); // FNV prime
        }

        return (hash >>> 0).toString(36);
    }
}