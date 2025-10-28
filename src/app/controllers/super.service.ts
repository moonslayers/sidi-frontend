import { inject, Injectable } from '@angular/core';
import { ApiServiceService, StandarResponse } from '../services/api/api-service.service';
import { firstValueFrom } from 'rxjs';
import { BaseModel } from '../models/base.model';
import { LocalStorageService } from '../services/localStorage/local-storage.service';
import { AdvancedSearchFilter } from '../shared/tabla/tabla.component';

export interface Conditional {
  key: string;
  operator: Operator;
  value: string | number | boolean | null;
}

export type SuperServiceAllParams<T> =
  | [options?: SuperServiceOptions<T>]
  | SuperServiceSeparatedParamsGet<T>
  | SuperServiceSeparatedParamsAll<T>
  | GenericSuperServiceParam<T>[]

export type SuperServiceSeparatedParamsGet<T> = [conditionals?: SuperServiceConditional<T>, paginator?: Paginator, relations?: string[], extraData?: Record<string, unknown>, loader?: boolean, columns?: (keyof T)[]]

export type SuperServiceSeparatedParamsAll<T> = [conditionals?: SuperServiceConditional<T>, relations?: string[], extraData?: Record<string, unknown>, loader?: boolean, columns?: (keyof T)[]]

export type SuperServiceConditional<T> = Partial<T> | Conditional[];

export type GenericSuperServiceParam<T> = SuperServiceConditional<T> | string[] | Record<string, unknown> | (keyof T)[] | boolean | SuperServiceOptions<T> | number | AdvancedSearchFilter[]

export interface SuperServiceOptions<T> {
  conditionals?: SuperServiceConditional<T>;
  paginator?: Paginator;
  relations?: string[];
  busquedaAvanzada?: AdvancedSearchFilter[];
  extraData?: Record<string, unknown>;
  columns?: (keyof T)[];
  advancedSearch?: AdvancedSearchFilter[];
  loader?: boolean;
}

export interface ModelFile<T> {
  data: Partial<T>;
  file?: File;
}

export type Operator = '=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'NOT LIKE' | '!=' | '<>' | 'IN' | 'NOT IN' | 'BETWEEN' | 'NOT BETWEEN' | 'IS NULL' | 'IS NOT NULL'

export interface Paginator {
  page: number;
  per_page: number;
  sort?: { column: string; desc: boolean }
}

@Injectable({
  providedIn: 'root'
})
export abstract class SuperService<T = BaseModel> {
  protected api = inject(ApiServiceService)
  protected storage =  inject(LocalStorageService)
  protected abstract model:string;
  protected abstract columns: (keyof T)[]

  /**
 * Constructs the base URL for the API endpoint.
 * 
 * @returns {string} The base URL for the API, combining the fixed path and the model name.
 */
  public url(): string {
    return 'api/' + this.model;
  }

  /**
   * Realiza una petición GET a la API para obtener un único registro del tipo `T` por su ID.
   *
   * Además de requerir un `id` numérico, permite personalizar la solicitud con parámetros
   * flexibles a través del tipo `SuperServiceAllParams<T>`, lo que posibilita incluir:
   * condiciones, relaciones, columnas específicas, paginación y más.
   *
   * @param id - El identificador numérico del registro a buscar.
   * @param params - Parámetros opcionales para personalizar la solicitud. Pueden ser:
   *   - Un objeto de tipo `SuperServiceOptions<T>`.
   *   - Un array con parámetros posicionales.
   *   - Un array de objetos genéricos como condiciones o filtros.
   *
   * @returns Una promesa que resuelve al objeto encontrado del tipo `T`, o `undefined` si no se encuentra.
   *
   * @example
   * // Ejemplo 1: Solo el ID
   * service.find(123);
   *
   * @example
   * // Ejemplo 2: ID + opciones con columnas específicas
   * service.find(123, {
   *   columns: ['id', 'name', 'email'],
   *   relations: ['user', 'role']
   * });
   *
   * @example
   * // Ejemplo 3: ID + condiciones y relaciones
   * service.find(123, [
   *   { key: 'status', operator: 'eq', value: 'active' }
   * ], ['user', 'role'], true, ['id', 'name']);
   *
   * @example
   * // Ejemplo 4: ID + columnas y loader
   * service.find(123, ['id', 'name', 'email'], true);
   */
  public async find(id: number, ...params: SuperServiceAllParams<T>): Promise<T | undefined> {
    const url = this.url() + '/' + id.toString();
    const queryParams = this.queryParamsFromSuperServiceParams(...params);

    return (await firstValueFrom(this.api.get<T>(url, queryParams, this.loaderFromParamas(params)))).data;
  }

  /**
   * Realiza una petición GET a la API para obtener una lista de registros del tipo `T`.
   *
   * Esta función acepta múltiples formatos de parámetros gracias al tipo `SuperServiceAllParams<T>`,
   * lo que permite flexibilidad a la hora de enviar condiciones, paginación, relaciones, columnas, etc.
   *
   * @param params - Parámetros para personalizar la solicitud. Pueden ser:
   *   - Un objeto de tipo `SuperServiceOptions<T>` (similar a una llamada con `{}`).
   *   - Un array con parámetros posicionales (similar a llamadas con múltiples argumentos).
   *   - Un array de objetos genéricos como condiciones o filtros.
   *
   * @returns Una promesa que resuelve a un array de objetos del tipo `T`.
   *
   * @example
   * // Ejemplo 1: Usando `SuperServiceOptions<T>`
   * service.all({
   *   conditionals: { name: 'John' },
   *   relations: ['user', 'role'],
   *   columns: ['id', 'name'],
   *   loader: true
   * });
   *
   * @example
   * // Ejemplo 2: Usando parámetros posicionales (con paginación)
   * service.all([{ name: 'John' }], { page: 1, limit: 10 }, ['user', 'role'], {}, true, ['id', 'name']);
   *
   * @example
   * // Ejemplo 3: Usando condiciones en forma de array de objetos `Conditional[]`
   * service.all([
   *   { key: 'name', operator: 'eq', value: 'John' },
   *   { key: 'age', operator: 'gt', value: 30 }
   * ]);
   *
   * @example
   * // Ejemplo 4: Solo columnas y loader
   * service.all(['id', 'name', 'email'], true);
   */
  public async all(...params: SuperServiceAllParams<T>): Promise<T[]> {
    const queryParams = this.queryParamsFromSuperServiceParams(...params)
    queryParams.page = 1
    queryParams.per_page = 999999
    return (await firstValueFrom(this.api.get<T[]>(this.url(), queryParams, this.loaderFromParamas(params, true)))).data ?? [];
  }

  /**
   * Crea un nuevo registro o restaura uno existente (si está marcado como eliminado lógicamente).
   *
   * Este método primero busca un registro que coincida con los datos proporcionados usando `this.get(...)`.
   * - Si encuentra un registro y tiene una propiedad `deleted_at` definida (eliminado lógicamente), lo restaura llamando a `this.switch(record, {}, loader)`.
   * - Si no encuentra ningún registro, crea uno nuevo llamando a `this.new(data, loader)`.
   *
   * @param data - Objeto parcial del tipo `T` usado para buscar o crear el registro.
   * @param loader - Indica si se debe mostrar un loader durante la operación (por defecto: `true`).
   *
   * @returns Una promesa que resuelve al registro encontrado y restaurado, al nuevo registro creado, o a `undefined` si no fue posible realizar ninguna de las dos acciones.
   *
   * @example
   * // Ejemplo 1: Crear o restaurar un usuario por nombre y email
   * const user = await service.createOrRestore({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * @example
   * // Ejemplo 2: Desactivar loader
   * const user = await service.createOrRestore(
   *   { email: 'john@example.com' },
   *   false
   * );
   */
  public async createOrRestore(
    data: Partial<T>,
    loader = true
  ): Promise<(T & BaseModel) | T | undefined> {
    const res = await this.get(data, undefined, [], {}, loader);

    if (res.data && res.data.length > 0) {
      const record = res.data[0] as T & BaseModel;

      if (record && record.deleted_at) {
        await this.switch(record, loader);
      }

      return record;
    } else {
      return await this.new(data, loader);
    }
  }

  /**
   * Busca un registro existente que coincida con los datos proporcionados.
   * Si no se encuentra ninguno, crea un nuevo registro con esos datos.
   *
   * Este método primero realiza una búsqueda usando `this.get(data)` (que internamente
   * debería usar `all(...)` o una lógica similar para obtener registros que coincidan
   * con el objeto `data`). Si se encuentra al menos un resultado, devuelve el primero.
   * Si no, llama a `this.new(data)` para crear un nuevo registro.
   *
   * @param data - Un objeto parcial del tipo `T` que contiene los campos necesarios
   *               para buscar o crear un nuevo registro.
   *
   * @returns Una promesa que resuelve al registro encontrado o creado del tipo `T`,
   *          o `undefined` si no fue posible encontrar ni crear el registro.
   *
   * @example
   * // Ejemplo 1: Buscar o crear un usuario por nombre y email
   * const user = await service.findOrCreate({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * @example
   * // Ejemplo 2: Usar solo campos parciales para buscar o crear
   * const product = await service.findOrCreate({
   *   sku: 'PROD-001'
   * });
   */
  public async findOrCreate(data: Partial<T>): Promise<T | undefined> {
    const res = (await this.get(data));
    if (res.data && res.data.length > 0) {
      return res.data[0];
    } else {
      return this.new(data);
    }
  }

  /**
   * Crea o actualiza un registro del tipo `T` según si el objeto `data` contiene un `id` válido.
   *
   * Si el objeto `data` contiene una propiedad `id` numérica y mayor que 0, se asume que
   * el registro ya existe y se llama al método `this.update(id, data)` para actualizarlo.
   *
   * Si no se proporciona un `id` válido, se asume que es un nuevo registro y se llama a
   * `this.new(data)` para crearlo.
   *
   * @param data - Un objeto parcial del tipo `T` que contiene los datos del registro.
   *               Si contiene un `id` numérico y positivo, se realizará una actualización.
   *
   * @returns Una promesa que resuelve al registro creado o actualizado del tipo `T`,
   *          o `undefined` si la operación falla.
   *
   * @example
   * // Ejemplo 1: Crear un nuevo registro (sin `id`)
   * const newUser = await service.createOrUpdate({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * @example
   * // Ejemplo 2: Actualizar un registro existente (con `id`)
   * const updatedUser = await service.createOrUpdate({
   *   id: 123,
   *   name: 'John Doe Updated',
   *   email: 'john_new@example.com'
   * });
   */
  async createOrUpdate(data: Partial<T>, loader = true): Promise<T | undefined> {
    if ('id' in data && typeof data.id === 'number' && data.id > 0) {
      const res = await this.update(data.id, data, loader);
      return res.status ? data as T : undefined;
    } else {
      return this.new(data, loader);
    }
  }


  /**
   * Obtiene el primer registro que coincide con los parámetros especificados.
   *
   * Este método utiliza internamente `this.get(...params)` para obtener una lista de registros
   * y devuelve el primer elemento del array resultante.
   *
   * @param params - Parámetros para personalizar la solicitud (condiciones, relaciones, columnas, etc.).
   *                 Acepta el mismo tipo de parámetros que `SuperServiceAllParams<T>`.
   *
   * @returns Una promesa que resuelve al primer registro del tipo `T` encontrado,
   *          o `undefined` si no hay resultados.
   *
   * @example
   * // Ejemplo 1: Obtener el primer registro
   * const firstUser = await service.first();
   *
   * @example
   * // Ejemplo 2: Obtener el primer registro que cumple una condición
   * const firstActiveUser = await service.first({ conditionals: { active: true } });
   *
   * @example
   * // Ejemplo 3: Usando condiciones avanzadas
   * const firstUserOver30 = await service.first([
   *   { key: 'age', operator: 'gt', value: 30 }
   * ]);
   */
  public async first(...params: SuperServiceAllParams<T>): Promise<T | undefined> {
    const res = (await this.get(...params)).data ?? [];
    return res[0];
  }

  /**
   * Obtiene el último registro que coincide con los parámetros especificados.
   *
   * Este método utiliza internamente `this.get(...params)` para obtener una lista de registros
   * y devuelve el último elemento del array resultante usando `Array.prototype.at(-1)`.
   *
   * @param params - Parámetros para personalizar la solicitud (condiciones, relaciones, columnas, etc.).
   *                 Acepta el mismo tipo de parámetros que `SuperServiceAllParams<T>`.
   *
   * @returns Una promesa que resuelve al último registro del tipo `T` encontrado,
   *          o `undefined` si no hay resultados.
   *
   * @example
   * // Ejemplo 1: Obtener el último registro
   * const lastUser = await service.last();
   *
   * @example
   * // Ejemplo 2: Obtener el último registro que cumple una condición
   * const lastActiveUser = await service.last({ conditionals: { active: true } });
   *
   * @example
   * // Ejemplo 3: Usando condiciones avanzadas
   * const lastUserOver30 = await service.last([
   *   { key: 'age', operator: 'gt', value: 30 }
   * ]);
   */
  public async last(...params: SuperServiceAllParams<T>): Promise<T | undefined> {
    const res = (await this.get(...params)).data ?? [];
    return res.at(-1);
  }


  /**
   * Realiza una petición GET a la API para obtener una lista de registros del tipo `T`.
   *
   * Este método acepta múltiples formatos de parámetros gracias al tipo `SuperServiceAllParams<T>`,
   * lo que permite flexibilidad a la hora de enviar condiciones, paginación, relaciones, columnas, etc.
   *
   * Si no se especifica `page` o `per_page` en los parámetros, se asignan valores por defecto:
   * - `page = 1`
   * - `per_page = 999`
   *
   * @param params - Parámetros para personalizar la solicitud. Pueden ser:
   *   - Un objeto de tipo `SuperServiceOptions<T>`
   *   - Un array con parámetros posicionales (similar a llamadas con múltiples argumentos)
   *   - Un array de objetos genéricos como condiciones o filtros
   *
   * @returns Una promesa que resuelve a un objeto de tipo `StandardResponse<T[]>` con los datos obtenidos.
   *
   * @example
   * // Ejemplo 1: Obtener todos los registros sin filtros
   * const response = await service.get();
   *
   * @example
   * // Ejemplo 2: Obtener registros con condiciones
   * const response = await service.get({
   *   conditionals: { name: 'John' },
   *   columns: ['id', 'name']
   * });
   *
   * @example
   * // Ejemplo 3: Usar condiciones con operadores avanzados
   * const response = await service.get([
   *   { key: 'age', operator: 'gt', value: 30 },
   *   { key: 'status', operator: 'eq', value: 'active' }
   * ]);
   *
   * @example
   * // Ejemplo 4: Usar paginación explícita
   * const response = await service.get({ page: 2, per_page: 20 });
   */
  public async get(...params: SuperServiceAllParams<T>): Promise<StandarResponse<T[]>> {
    const queryParams = this.queryParamsFromSuperServiceParams(...params);
    if (!queryParams.page) {
      queryParams.page = 1;
    }

    if (!queryParams.per_page) {
      queryParams.per_page = 999;
    }

    return firstValueFrom(this.api.get<T[]>(this.url(), queryParams, this.loaderFromParamas(params, true) ));
  }

  /**
   * Crea un nuevo registro del tipo `T (generico)` en el servidor.
   *
   * Este método permite enviar datos de dos formas:
   * - Como un objeto parcial del tipo `T` (ideal para datos normales).
   * - Como un objeto de tipo `ModelFile<T>` que incluye un archivo adjunto (`File`), útil para formularios con imágenes o documentos.
   *
   * Si se proporciona un archivo, se envía mediante `FormData` con dos campos:
   * - `data`: Los datos del modelo serializados como JSON.
   * - `file`: El archivo adjunto (opcional).
   *
   * @param data - Datos para crear el registro. Puede ser:
   *   - Un objeto parcial del tipo `T` (sin `File`).
   *   - Un objeto `ModelFile<T>` que incluya un archivo opcional.
   * @param loader - Indica si se debe mostrar un loader durante la petición (por defecto: `true`).
   *
   * @returns Una promesa que resuelve al nuevo registro del tipo `T` creado por el servidor,
   *          o `undefined` si la operación falla.
   *
   * @example
   * // Ejemplo 1: Crear un registro sin archivo
   * const newUser = await service.new({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   *
   * @example
   * // Ejemplo 2: Crear un registro con archivo
   * const newProduct = await service.new({
   *   data: {
   *     name: 'Producto con imagen',
   *     price: 19.99
   *   },
   *   file: fileInput // un objeto File del input del usuario
   * });
   */
  public async new(data: Partial<T> | ModelFile<T>, loader = true): Promise<T | undefined> {
    if (this.isModelFile(data)) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data.data));
      if (data.file) {
        formData.append('file', data.file);
      }
      return (await firstValueFrom(this.api.postFormData<T>(this.url(), formData, loader))).data;
    }

    return (await firstValueFrom(this.api.post<T>(this.url(), data, {}, loader))).data;
  }

  /**
   * Actualiza un registro existente del tipo `T` en el servidor.
   *
   * Este método acepta parámetros de dos formas:
   * - Como una tupla con estructura fija: `[id, data, loader?]`
   * - Como un array heterogéneo con los valores en cualquier orden: `[id, data, loader]`
   *
   * El método identifica automáticamente:
   * - El `id` del registro (número)
   * - Los datos a actualizar (`Partial<T & BaseModel>`)
   * - Si se debe mostrar un loader (`boolean`, opcional)
   *
   * @param params - Puede ser:
   *   - Una tupla con: `[id: number, data: Partial<T & BaseModel>, loader?: boolean]`
   *   - Un array con los mismos valores en cualquier orden: `[number, Partial<T>, boolean]`
   *
   * @returns Una promesa que resuelve a un objeto de tipo `StandardResponse` que indica el resultado de la operación.
   *
   * @example
   * // Ejemplo 1: Llamada con parámetros posicionales
   * const res = await service.update(123, { name: 'Nuevo nombre' });
   *
   * @example
   * // Ejemplo 2: Llamada con loader desactivado
   * const res = await service.update(123, { name: 'Nuevo nombre' }, false);
   *
   * @example
   * // Ejemplo 3: Llamada con array heterogéneo (orden distinto)
   * const res = await service.update([false, { name: 'Nuevo nombre' }, 123]);
   */
  public async update(
    ...params: (
      [id: number, data: Partial<T & BaseModel>, loader?: boolean] |
      (number | Partial<T> | boolean)[]
    )
  ): Promise<StandarResponse<T>> {
    const data = params.find((p): p is Partial<T & BaseModel> => typeof p === 'object');
    const id = params.find((p): p is number => typeof p === 'number') ?? data?.id;
    const loader = !!params.find((p): p is boolean => typeof p === 'boolean');
    const url = `${this.url()}/${id}`;

    return firstValueFrom(this.api.put<T>(url, data, loader));
  }


  /**
   * Actualiza rápidamente un modelo existente con nuevos datos y refleja los cambios localmente si la actualización es exitosa.
   *
   * Este método realiza una llamada a `this.update(id, dataToUpdate, false)` para actualizar los datos en el servidor.
   * Si la actualización es exitosa (`res.status === true`), también actualiza el modelo localmente con `Object.assign(model, dataToUpdate)`.
   *
   * @param model - El modelo existente que se va a actualizar. Debe contener una propiedad `id` numérica.
   *                Puede ser un `Partial<T & BaseModel>` o un modelo completo. Si es `undefined` o no tiene `id`, retorna `false`.
   * @param dataToUpdate - Un objeto con los campos a actualizar del modelo.
   *
   * @returns Una promesa que resuelve a `true` si la actualización fue exitosa, o `false` si falló o no se pudo realizar.
   *
   * @example
   * // Ejemplo 1: Actualizar un modelo existente
   * const updated = await service.fastUpdate(userModel, {
   *   name: 'Nuevo Nombre',
   *   email: 'nuevo@example.com'
   * });
   *
   * if (updated) {
   *   console.log('Usuario actualizado local y remotamente');
   * }
   *
   * @example
   * // Ejemplo 2: Usar con un modelo parcial
   * const updated = await service.fastUpdate(
   *   { id: 123, name: 'Antiguo' },
   *   { name: 'Nuevo Nombre' }
   * );
   */
  public async fastUpdate(
    model: Partial<T & BaseModel> | T & BaseModel | undefined,
    dataToUpdate: Partial<T & BaseModel>
  ): Promise<boolean> {
    if (!model?.id) return false;

    const res = await this.update(model.id, dataToUpdate, false);
    if (res.status) {
      Object.assign(model, dataToUpdate);
    }
    return res.status;
  }


  /**
   * Creates multiple new records in the API.
   * 
   * @param {Partial<T>[]} data - An array of partial data objects representing the new records to be created.
   * @returns {Promise<boolean>} A promise that resolves with `true` if the operation is successful.
   */
  public async multipleNews(data: Partial<T>[]): Promise<boolean> {
    return (await firstValueFrom(this.api.post(this.url(), data))).status;
  }

  /**
   * Update multiple existing and nor existing records in the API.
   * 
   * @param {Partial<T>[]} data - An array of partial data objects representing the new records to be updated.
   * @returns {Promise<boolean>} A promise that resolves with `true` if the operation is successful.
   */
  public async multipleUpdate(data: Partial<T>[], loader?: boolean, toast?: boolean): Promise<boolean> {
    return (await firstValueFrom(this.api.put(this.url() + '/multiple', data, loader, toast))).status;
  }

  /**
   * Toggles the state of a record by its ID.
   * 
   * @param {number} data - The unique identifier of the record to toggle.
   * @returns {Promise<boolean>} A promise that resolves with `true` if the operation is successful.
   */
  public async switch(data: number | ((T & BaseModel) | (Partial<T & BaseModel>)), loader = true): Promise<boolean> {
    if (typeof data === 'number') {
      return (await firstValueFrom(this.api.delete(this.url() + '/' + data, loader))).status;
    }
    const status = (await firstValueFrom(this.api.delete(this.url() + '/' + data.id, loader))).status;
    if (status) {
      data.deleted_at = data.deleted_at ? null : (new Date()).toISOString()
    }
    return status
  }

  //AQUI EMPIEZAN METODOS PRIVADOS O UTILERIA

  /**
   * Converts a model object into an array of query parameters for filtering.
   * 
   * @param {Partial<T>} model - The partial data object representing the conditions.
   * @param {Operator} [operator='='] - The comparison operator to use for the conditions.
   * @returns {(string | number)[][]} An array of query parameters derived from the model.
   */
  public paramsFromModel(model: Partial<T>, operator: Operator = '='): (string | number)[][] {
    const params = [];

    for (const key of Object.keys(model) as (keyof T)[]) {
      const value = model[key];

      if (value !== undefined && value !== null) {
        params.push([key, operator, value] as (string | number)[]);
      }
      if (value === null) {
        params.push([key, 'IS NULL', value] as (string | number)[]);
      }
    }
    return params;
  }

  /**
   * recibe una lista de objetos condicionales y regresa una lista de listas
   * @param {Conditional[]} conditionals
  * @returns {string|numbe|null[][]} lista de datos condicionales
   */
  protected paramsFromConditionals(conditionals: Conditional[]): (string | number | null | boolean)[][] {
    const params = []
    for (const cond of conditionals) {
      params.push([cond.key, cond.operator, cond.value])
    }
    return params
  }

  public get _model() {
    return this.model
  }

  /**
   * Determina si se debe mostrar un loader basándose en los parámetros pasados a métodos como `all`, `get`, `find`, etc.
   *
   * Este método busca:
   * - Un valor booleano directamente en los `params`.
   * - Si no encuentra uno, busca dentro de un objeto `SuperServiceOptions<T>` que pueda contener la propiedad `loader`.
   *
   * Si no se encuentra ningún valor para `loader`, devuelve el valor por defecto proporcionado.
   *
   * @param params - Parámetros pasados a métodos como `all`, `get`, `find`, etc.
   *                 Pueden incluir un booleano directo o un objeto con la propiedad `loader`.
   * @param defaultValue - Valor por defecto a devolver si no se encuentra ningún valor para `loader`. Por defecto es `false`.
   *
   * @returns `true` si se debe mostrar el loader, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Usar loader explícito en parámetros
   * this.loaderFromParamas([true]); // true
   *
   * @example
   * // Ejemplo 2: Usar loader en un objeto de opciones
   * this.loaderFromParamas([{ loader: true }]); // true
   *
   * @example
   * // Ejemplo 3: Usar valor por defecto
   * this.loaderFromParamas([]); // false
   * this.loaderFromParamas([], true); // true
   */
  protected loaderFromParamas(
    params: SuperServiceAllParams<T>,
    defaultValue?: boolean
  ): boolean {
    const options = params.find((p): p is SuperServiceOptions<T> => this.isSuperServiceOptions(p));
    const loader = params.find(p => typeof p === 'boolean') ?? options?.loader;
    return loader ?? defaultValue ?? false;
  }

  /**
   * Convierte los parámetros dinámicos de tipo `SuperServiceAllParams<T>` en un objeto de parámetros de consulta
   * que puede ser enviado en una petición HTTP (por ejemplo, como `queryParams` en una llamada GET).
   *
   * Este método busca en los `options` los siguientes tipos de parámetros:
   * - **Condicionales** (`Conditional[]` o `Partial<T>`)
   * - **Columnas** (`(keyof T)[]`)
   * - **Relaciones** (`string[]`)
   * - **Paginación** (`Paginator`)
   * - **Búsqueda avanzada** (`AdvancedSearchFilter[]`)
   * - **Datos extra** (`Record<string, unknown>`)
   *
   * Si no se encuentran directamente, busca dentro de un objeto `SuperServiceOptions<T>`.
   *
   * Toodos los valores se serializan a JSON, excepto `extraData` y `paginator`, que se mezclan directamente en el objeto final.
   *
   * @param options - Parámetros dinámicos que pueden incluir:
   *   - Un objeto de opciones (`SuperServiceOptions<T>`)
   *   - Arrays de condiciones, columnas, relaciones, etc.
   *   - Booleanos, números u otros tipos (ignorados si no son relevantes)
   *
   * @returns Un objeto con los parámetros normalizados listos para usar como `queryParams` en una petición HTTP.
   *
   * @example
   * // Ejemplo 1: Usar con objeto de opciones
   * const params = this.queryParamsFromSuperServiceParams({
   *   conditionals: { name: 'John' },
   *   columns: ['id', 'name'],
   *   relations: ['user', 'role'],
   *   paginator: { page: 1, per_page: 20 }
   * });
   *
   * // Resultado:
   * {
   *   conditionals: "[[\"name\",\"eq\",\"John\"]]",
   *   relations: "[\"user\",\"role\"]",
   *   columns: "[\"id\",\"name\"]",
   *   paginator: "{\"page\":1,\"per_page\":20}"
   * }
   *
   * @example
   * // Ejemplo 2: Usar con parámetros posicionales
   * const params = this.queryParamsFromSuperServiceParams(
   *   [{ key: 'name', operator: 'eq', value: 'John' }],
   *   ['id', 'name'],
   *   ['user', 'role'],
   *   { page: 2, per_page: 50 }
   * );
   */
  protected queryParamsFromSuperServiceParams(...options: SuperServiceAllParams<T>) {
    const superOption = options.find((p): p is SuperServiceOptions<T> => this.isSuperServiceOptions(p))
    const conditionals = options.find((p): p is Conditional[] => this.isSuperServiceConditional(p)) ?? superOption?.conditionals
    const columns = options.find((p): p is (keyof T)[] => this.isModelColumns(p)) ?? superOption?.columns
    const relations = options.find((p): p is string[] => this.isStringArray(p)) ?? superOption?.relations
    const paginator = options.find((p): p is Paginator => this.isPaginator(p)) ?? superOption?.paginator
    const busqueda_avanzada = options.find((p): p is AdvancedSearchFilter[] => this.isAdvancedSearchFilter(p)) ?? superOption?.advancedSearch
    const extraData = options.find((p): p is Record<string, unknown> => this.isExtraData(p)) ?? superOption?.extraData

    let params: (string | number | boolean | null)[][] = [];
    if (Array.isArray(conditionals)) {
      params = this.paramsFromConditionals(conditionals);
    } else if (conditionals) {
      params = this.paramsFromModel(conditionals);
    }

    if(!params.length){
      params.push(['deleted_at','IS NULL', null])
    }
    
    const parsedData={
      conditionals: JSON.stringify(params),
      relations: JSON.stringify(relations),
      columns: JSON.stringify(columns),
      paginator: JSON.stringify(paginator),
      busqueda_avanzada: JSON.stringify(busqueda_avanzada),
      ...extraData,
      ...paginator,
    }
    return parsedData
  }

  /**
   * Determina si un valor dado es un objeto del tipo `SuperServiceOptions<T>`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para considerarse un `SuperServiceOptions<T>`, el objeto debe:
   * - Tener al menos **una** de las siguientes propiedades definidas:
   *   - `conditionals`
   *   - `extraData`
   *   - `paginator`
   *   - `loader`
   *   - `relations`
   *   - `advancedSearch`
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es un objeto `SuperServiceOptions<T>`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Objeto válido
   * const options = {
   *   conditionals: { name: 'John' },
   *   relations: ['user', 'role']
   * };
   * this.isSuperServiceOptions(options); // true
   *
   * @example
   * // Ejemplo 2: Objeto inválido (sin propiedades reconocidas)
   * this.isSuperServiceOptions({}); // false
   *
   * @example
   * // Ejemplo 3: Usado como type guard en una condición
   * if (this.isSuperServiceOptions(value)) {
   *   // TypeScript ahora sabe que `value` es de tipo `SuperServiceOptions<T>`
   *   console.log(value.conditionals);
   * }
   */
  protected isSuperServiceOptions(value: unknown): value is SuperServiceOptions<T> {
    if (value === undefined) return false;
    const op = value as SuperServiceOptions<T>;
    return (
      (op.conditionals !== undefined && this.isSuperServiceConditional(op.conditionals)) ||
      op.extraData !== undefined ||
      (op.paginator !== undefined && this.isPaginator(op.paginator)) ||
      (op.loader && typeof op.loader=='boolean') !== undefined ||
      (op.relations !== undefined && Array.isArray(op.relations)) ||
      (op.advancedSearch && this.isAdvancedSearchFilter(op.advancedSearch)) !== undefined
    );
  }

  /**
   * Determina si un valor dado puede considerarse como `extraData`, es decir, un objeto genérico
   * con datos adicionales que **no** corresponde a otros tipos conocidos como `Paginator`,
   * `SuperServiceOptions`, `Conditional[]`, etc.
   *
   * Este método actúa como un **type guard** en TypeScript, permitiendo que el compilador
   * infiera correctamente el tipo dentro de bloques condicionales.
   *
   * Para considerarse `extraData`, el valor debe:
   * - Ser un objeto (no `null` ni `undefined`)
   * - No ser un array
   * - Tener todas las claves como cadenas
   * - Tener al menos una clave que **no** sea parte de palabras clave reservadas
   *   como `'conditionals'`, `'paginator'`, `'loader'`, `'relations'`
   * - No ser un objeto `Paginator`
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor puede considerarse `extraData`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Objeto válido como extraData
   * const data = { filter: 'active', includeDeleted: false };
   * this.isExtraData(data); // true
   *
   * @example
   * // Ejemplo 2: No es extraData (palabra clave reservada)
   * const data = { paginator: { page: 1, per_page: 10 } };
   * this.isExtraData(data); // false
   *
   * @example
   * // Ejemplo 3: No es extraData (es un array)
   * const data = [{ key: 'name', operator: 'eq', value: 'John' }];
   * this.isExtraData(data); // false
   *
   * @example
   * // Ejemplo 4: Usado como type guard en una condición
   * if (this.isExtraData(value)) {
   *   // TypeScript ahora sabe que `value` es de tipo `Record<string, unknown>`
   *   console.log(value.filter);
   * }
   */
  protected isExtraData(value: unknown): value is Record<string, unknown> {
    if(!value) return false;
    const keys = Object.keys(value);
    return (
      value &&
      !Array.isArray(value) &&
      keys.every(k => typeof k === 'string') &&
      keys.some(k => !['conditionals', 'paginator', 'loader', 'relations', 'busquedaAvanzada'].includes(k)) &&
      !this.isPaginator(value) &&
      !this.isSuperServiceConditional(value) &&
      !this.isSuperServiceOptions(value)
    );
  }

  /**
   * Determina si un valor dado es un objeto del tipo `SuperServiceConditional<T>`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Un valor se considera `SuperServiceConditional<T>` si:
   * - Es un array de objetos de tipo `Conditional` (con `key`, `operator` y `value`), o
   * - Es un objeto de tipo `Partial<T>` (es decir, un subconjunto de propiedades del modelo)
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es de tipo `SuperServiceConditional<T>`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Conditional[] válido
   * const conditionals = [
   *   { key: 'name', operator: 'eq', value: 'John' },
   *   { key: 'age', operator: 'gt', value: 30 }
   * ];
   * this.isSuperServiceConditional(conditionals); // true
   *
   * @example
   * // Ejemplo 2: Partial<T> válido
   * const conditionals = { name: 'John', active: true };
   * this.isSuperServiceConditional(conditionals); // true
   *
   * @example
   * // Ejemplo 3: Valor inválido (no es array ni objeto)
   * this.isSuperServiceConditional('invalid'); // false
   *
   * @example
   * // Ejemplo 4: Usado como type guard en una condición
   * if (this.isSuperServiceConditional(value)) {
   *   // TypeScript ahora sabe que `value` es de tipo `SuperServiceConditional<T>`
   *   if (Array.isArray(value)) {
   *     // Es un Conditional[]
   *   } else {
   *     // Es un Partial<T>
   *   }
   * }
   */
  protected isSuperServiceConditional<T>(value: unknown): value is SuperServiceConditional<T> {
    if( value === null || value === undefined) return false;
    // Si es un array, comprobamos que sea un Conditional[]
    if (Array.isArray(value)) {
      return value.length === 0 || value.every((item): item is Conditional => {
        return (
          typeof item === 'object' &&
          item !== null &&
          'key' in item &&
          'operator' in item &&
          'value' in item
        );
      });
    }

    const keys = Object.keys(value)

    // Si es un objeto, asumimos que es Partial<T>
    return (
      typeof value === 'object' &&
      this.isModelColumns(keys) &&
      !Array.isArray(value)
    );
  }

  /**
   * Determina si un valor dado es un array válido de columnas del modelo, es decir, un array de tipo `(keyof T)[]`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para ser considerado válido, el valor debe:
   * - Ser un array
   * - No estar vacío
   * - Cada elemento debe ser una cadena (`string`)
   * - Cada elemento debe ser una columna definida en `this.columns` (propiedad del servicio)
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es un array válido de columnas del modelo, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Valor válido
   * const columns = ['id', 'name'];
   * this.isModelColumns(columns); // true (si 'id' y 'name' están en `this.columns`)
   *
   * @example
   * // Ejemplo 2: Valor inválido (no es array)
   * this.isModelColumns('id,name'); // false
   *
   * @example
   * // Ejemplo 3: Valor inválido (columna no definida)
   * const columns = ['id', 'invalidColumn'];
   * this.isModelColumns(columns); // false (si 'invalidColumn' no está en `this.columns`)
   *
   * @example
   * // Ejemplo 4: Usado como type guard en una condición
   * if (this.isModelColumns(value)) {
   *   // TypeScript ahora sabe que `value` es de tipo `(keyof T)[]`
   *   console.log('Columnas válidas:', value);
   * }
   */
  protected isModelColumns<T>(value: unknown): value is (keyof T)[] {
    if (!this.columns.length) {
      console.warn('No hay columnas definidas en el modelo: ' + this.model);
      return false;
    }

    // Si no es un array → inválido
    if (!Array.isArray(value)) {
      return false;
    }

    // Si es un array vacío → inválido
    if (value.length === 0) {
      return false;
    }
    const keys = [...(this.columns as string[]),'deleted_at','created_at', 'id', 'created_by']

    const keysNoEncontradas = value.filter(k => !keys.includes(k))
    if(keysNoEncontradas.length && !this.isSuperServiceOptions(value) && !this.isAdvancedSearchFilter(value) ){
      if(keysNoEncontradas.length==1 && keysNoEncontradas[0]=='*') return false;
      //console.warn('Keys no encontradas en columns. Revisar controlador del modelo: ' + this.model, keysNoEncontradas)
      return false;
    }

    // Cada item debe ser un string y estar en `this.columns`
    return true
  }

  /**
   * Determina si un valor dado es un objeto del tipo `Paginator`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para ser considerado un `Paginator`, el objeto debe tener definidas las propiedades:
   * - `page`: número de página actual
   * - `per_page`: cantidad de registros por página
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es de tipo `Paginator`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Valor válido
   * const paginator = { page: 1, per_page: 20 };
   * this.isPaginator(paginator); // true
   *
   * @example
   * // Ejemplo 2: Valor inválido
   * const invalid = { page: 1 };
   * this.isPaginator(invalid); // false
   *
   * @example
   * // Ejemplo 3: Usado como type guard
   * if (this.isPaginator(value)) {
   *   console.log(`Página: ${value.page}, Registros por página: ${value.per_page}`);
   * }
   */
  protected isPaginator(value: unknown): value is Paginator {
    return !!value && (value as Paginator).page !== undefined && (value as Paginator).per_page !== undefined;
  }

  /**
   * Determina si un valor dado es un array de cadenas de texto (`string[]`).
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para ser considerado válido, el valor debe:
   * - Ser un array
   * - No estar vacío
   * - Todos los elementos deben ser del tipo `string`
   * - **No ser un array de columnas del modelo** (ver `isModelColumns`)
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es un array de cadenas válido, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Valor válido
   * const arr = ['user', 'role'];
   * this.isStringArray(arr); // true
   *
   * @example
   * // Ejemplo 2: Valor inválido (no es array)
   * this.isStringArray('user'); // false
   *
   * @example
   * // Ejemplo 3: Valor inválido (es un array de columnas del modelo)
   * const columns = ['id', 'name'];
   * this.isStringArray(columns); // false (si 'id' y 'name' son columnas del modelo)
   *
   * @example
   * // Ejemplo 4: Usado como type guard
   * if (this.isStringArray(value)) {
   *   value.forEach(item => console.log(item));
   * }
   */
  protected isStringArray(value: unknown): value is string[] {
    return (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(row => typeof row === 'string') &&
      !this.isModelColumns(value)
    );
  }

  /**
   * Determina si un valor dado es un array de filtros de búsqueda avanzada del tipo `AdvancedSearchFilter[]`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para ser considerado válido, el valor debe:
   * - Ser un array
   * - Cada elemento debe tener las siguientes propiedades:
   *   - `relation`: la relación a filtrar
   *   - `conditionals`: condiciones normales
   *   - `andConditionals`: condiciones adicionales
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es de tipo `AdvancedSearchFilter[]`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Valor válido
   * const filters = [{
   *   relation: 'user',
   *   conditionals: { name: 'John' },
   *   andConditionals: []
   * }];
   * this.isAdvancedSearchFilter(filters); // true
   *
   * @example
   * // Ejemplo 2: Valor inválido
   * const invalid = [{ relation: 'user' }];
   * this.isAdvancedSearchFilter(invalid); // false
   *
   * @example
   * // Ejemplo 3: Usado como type guard
   * if (this.isAdvancedSearchFilter(value)) {
   *   console.log('Filtros avanzados:', value);
   * }
   */
  protected isAdvancedSearchFilter(value: unknown): value is AdvancedSearchFilter[] {
    return (
      Array.isArray(value) &&
      value.every(f =>
        (f as AdvancedSearchFilter).relation !== undefined &&
        (f as AdvancedSearchFilter).conditionals !== undefined &&
        (f as AdvancedSearchFilter).andConditionals !== undefined
      )
    );
  }

  /**
   * Determina si un valor dado es un objeto del tipo `ModelFile<unknown>`.
   *
   * Este método actúa como un **type guard** en TypeScript, lo que permite al compilador
   * inferir correctamente el tipo dentro de bloques condicionales.
   *
   * Para ser considerado válido, el objeto debe tener definida la propiedad:
   * - `data`: un objeto parcial del modelo
   *
   * @param value - El valor a comprobar. Puede ser cualquier tipo (`unknown`).
   *
   * @returns `true` si el valor es de tipo `ModelFile<unknown>`, `false` en caso contrario.
   *
   * @example
   * // Ejemplo 1: Valor válido
   * const modelFile = {
   *   data: { name: 'Producto 1' },
   *   file: new File([''], 'test.jpg')
   * };
   * this.isModelFile(modelFile); // true
   *
   * @example
   * // Ejemplo 2: Valor inválido
   * const invalid = { file: new File([''], 'test.jpg') };
   * this.isModelFile(invalid); // false
   *
   * @example
   * // Ejemplo 3: Usado como type guard
   * if (this.isModelFile(value)) {
   *   console.log('Datos del modelo:', value.data);
   *   if (value.file) {
   *     console.log('Archivo adjunto:', value.file.name);
   *   }
   * }
   */
  protected isModelFile(v: unknown): v is ModelFile<unknown> {
    return (v as ModelFile<unknown>).data !== undefined;
  }

  [key: string]: unknown;
}