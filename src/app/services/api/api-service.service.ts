import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/local-storage.service';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, catchError, finalize, of, tap, EMPTY, map } from 'rxjs';
import { LoaderService } from '../loader/loader.service';
import { environment } from '../../../environments/environment';
import { VanillaDialogService } from '../vanilla-dialog/vanilla-dialog.service';
import { Router } from '@angular/router';
import { ToastService } from '../toast.service';

export interface StandarResponse<T = unknown> {
  status: boolean;
  data?: T;
  message: string;
  per_page?: number;
  page?: number;
  total_pages?: number;
  total_items?: number;
}

export interface FileSaveResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  activeHttpRequests = 0;
  //usa variable de enviroment dev para localhost no strings
  private apiUrl = environment.api_url;

  private http = inject(HttpClient)
  private localstorage = inject(LocalStorageService)
  private loader = inject(LoaderService)
  private dialog = inject(VanillaDialogService)
  private router = inject(Router)
  private toast = inject(ToastService)

  /**
   * Creates HTTP headers containing the authentication token.
   * The token is retrieved from local storage and added as a
   * `Bearer` token in the `Authorization` header.
   *
   * @returns {HttpHeaders} HTTP headers including the `Authorization` header with the token.
   */
  private createAuthHeaders(): HttpHeaders {
    const token = this.localstorage.getUserToken();
    let headers = new HttpHeaders();

    if (token) {
      // Se establece la cabecera 'Authorization' con el formato 'Bearer <token>'
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  postFormData<T = unknown>(
    endpoint: string,
    data: FormData,
    loader = false,
  ): Observable<FileSaveResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;
    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    return this.http.post<FileSaveResponse<T>>(url, data, { headers }).pipe(
      catchError((error) => this.catchErrorOnObservable(error)),
      tap((response) => {
        if (response.status) {
          this.toast.show({
            message: response.message ?? 'Todo correcto.',
          });
        }
      }),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Sends a POST request to the specified API endpoint with optional loading state management.
   * This method includes the `Authorization` header with the token and can show a loader during the request.
   *
   * @param {string} endpoint - The API endpoint to send the POST request to.
   * @param {T} [data={}] - The data to send with the POST request. Defaults to an empty object.
   * @param {boolean} [loader=true] - Whether to show a loader during the request. Defaults to `true`.
   * @returns {Observable<StandarResponse>} Observable emitting the response from the API with status and message.
   */
  post<T>(
    endpoint: string,
    data: unknown | undefined = undefined,
    extraData: Record<string, unknown> = {},
    loader = false,
  ): Observable<StandarResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    const dataPost = {
      data: data,
      ...extraData,
    };

    return this.http.post<StandarResponse<T>>(url, dataPost, { headers }).pipe(
      catchError((error) => this.catchErrorOnObservable(error)),
      tap((response) => {
        if (response.status) {
          this.toast.show({
            message: response.message ?? 'Todo correcto.',
          });
        }
      }),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Sends an HTTP GET request to the specified endpoint with optional query parameters.
   *
   * @template T The expected response type.
   * @param {string} endpoint - The API endpoint to send the request to.
   * @param {{ [key: string]: unknown }} [queryParams={}] - An object containing query parameters to append to the request.
   * @param {boolean} [loader=true] - Whether to show a loading indicator during the request.
   * @returns {Observable<StandarResponse<T>>} An observable that emits the server's response.
   */
  get<T>(
    endpoint: string,
    queryParams: Record<string, unknown> = {},
    loader = true,
  ): Observable<StandarResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    // Add query parameters
    let params = new HttpParams();
    for (const key in queryParams) {
      if (
        queryParams[key] !== undefined &&
        queryParams[key] !== null
      ) {
        const value = queryParams[key];
        if (typeof value == 'object') {
          params = params.set(key, JSON.stringify(value));
        } else {
          params = params.set(key, queryParams[key].toString());
        }
      }
    }

    return this.http.get<StandarResponse<T>>(url, { headers, params }).pipe(
      catchError((error) => this.catchErrorOnObservable(error)),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Sends an HTTP PUT request to the specified endpoint with the provided data.
   *
   * @template T The expected response type.
   * @param {string} endpoint - The API endpoint to send the request to.
   * @param {unknown} data - The payload to send in the request body.
   * @param {boolean} [loader=true] - Whether to show a loading indicator during the request.
   * @returns {Observable<StandarResponse<T>>} An observable that emits the server's response.
   */
  put<T>(
    endpoint: string,
    data: unknown,
    loader = false,
    toast = true,
  ): Observable<StandarResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    return this.http.put<StandarResponse<T>>(url, { data }, { headers }).pipe(
      catchError((error) => this.catchErrorOnObservable(error)),
      tap((response) => {
        if (response.status) {
          if (toast) {
            this.toast.show({
              message: response.message,
            });
          }
        }
      }),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Sends an HTTP DELETE request to the specified endpoint.
   *
   * @template T The expected response type.
   * @param {string} endpoint - The API endpoint to send the request to.
   * @param {boolean} [loader=true] - Whether to show a loading indicator during the request.
   * @returns {Observable<StandarResponse<T>>} An observable that emits the server's response.
   */
  delete<T>(
    endpoint: string,
    loader = false,
  ): Observable<StandarResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    return this.http.delete<StandarResponse<T>>(url, { headers }).pipe(
      catchError((error) => this.catchErrorOnObservable(error)),
      tap((response) => {
        if (response.status) {
          this.toast.show({
            message: response.message,
          });
        }
      }),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Downloads a file from the specified endpoint using authentication.
   * This method handles blob responses for file downloads.
   *
   * @param {string} endpoint - The API endpoint to download the file from.
   * @param {boolean} [loader=true] - Whether to show a loading indicator during the request.
   * @returns {Observable<Blob>} An observable that emits the file as a Blob.
   */
  downloadFile(
    endpoint: string,
    loader = true,
  ): Observable<Blob> {
    const url = `${this.apiUrl}/${endpoint}`;

    // Show loader if enabled
    if (loader) {
      this.loader.toggleLoader(true);
    }

    const headers = this.createAuthHeaders();

    return this.http.get(url, {
      headers,
      responseType: 'blob'
    }).pipe(
      map((response: Blob) => {
        // Convert ArrayBuffer to Blob if needed
        return response instanceof Blob ? response : new Blob([response]);
      }),
      catchError((error) => {
        this.catchErrorOnObservable(error);
        return EMPTY; // Return empty observable on error
      }),
      finalize(() => {
        if (loader) {
          this.loader.toggleLoader(false);
        }
      }),
    );
  }

  /**
   * Handles errors from HTTP requests without interrupting the data flow.
   * Returns an object with the same structure as a successful response but indicates failure.
   *
   * @param {HttpErrorResponse} error - The HTTP error response received.
   * @returns {{ estatus: boolean; data: null; message: string }} An object representing the error response.
   */
  private catchErrorOnObservable(error: HttpErrorResponse): Observable<{
    status: boolean;
    message: string;
  }> {
    switch (error.status) {
      case 401:
        this.dialog.show({
          title: 'No autorizado',
          body: 'La sesión se cerró, inicie sesión nuevamente para continuar.',
          tipo: 'danger',
        });
        this.localstorage.deleteUser();
        this.router.navigate(['/login']);
        break;
      case 403:
        this.dialog.show({
          title: 'No tiene el permiso adecuado',
          body: error.error.message ?? error.message,
          tipo: 'danger',
        });
        break;
      case 422:
        this.dialog.show({
          title: 'Algo salió mal',
          body:
            error.error.message ??
            error.message ??
            'Algo inesperado sucedio en el servidor, intente más tarde o reporte a un técnico.',
          tipo: 'danger',
        });
        break;
      case 500:
        this.dialog.show({
          title: 'Algo salió mal',
          body: 'Algo inesperado sucedió en el servidor. Intente más tarde y, si el problema persiste, consulte a un técnico o administrador.',
          tipo: 'danger',
        });
        break;
      default:
        this.dialog.show({
          title: 'Algo salio mal',
          body:
            error.error?.message ??
            'Algo inesperado sucedio en el servidor, intente más tarde o reporte a un técnico.',
          tipo: 'danger',
        });
    }
    // console.error(error);

    // Retornar un objeto que indica un fallo sin interrumpir el flujo de datos
    return of({
      status: false,
      message: error.message || 'Error inesperado',
    });
  }
}
