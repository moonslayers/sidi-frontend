import { Injectable } from '@angular/core';
import { APP_VERSION } from '../version';

@Injectable({
    providedIn: 'root'
})
export class VersionService {
    getVersion(): string {
        return APP_VERSION;
    }
}