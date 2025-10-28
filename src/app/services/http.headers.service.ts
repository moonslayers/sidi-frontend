import { HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LocalStorageService } from "./localStorage/local-storage.service";

@Injectable({
    providedIn:'root'
})
export class HttpHeadersService {
    private localstorage = inject(LocalStorageService)

    /**
     * Creates HTTP headers containing the authentication token.
     * The token is retrieved from local storage and added as a
     * `Bearer` token in the `Authorization` header.
     *
     * @returns {HttpHeaders} HTTP headers including the `Authorization` header with the token.
     */
    public createAuthHeaders(): HttpHeaders {
        const token = this.localstorage.getUserToken();
        let headers = new HttpHeaders();

        if (token) {
            // Se establece la cabecera 'Authorization' con el formato 'Bearer <token>'
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }
}