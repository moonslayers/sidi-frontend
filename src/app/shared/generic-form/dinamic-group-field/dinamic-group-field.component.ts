import { Component, EventEmitter, Input, Output, SimpleChanges, inject, OnInit, OnChanges } from '@angular/core';

import { Button, ButtonComponent } from '../../button/button.component';
import { FormField, FormFieldComponent } from '../form-field/form-field.component';
import { GroupStyle } from '../form-group/form-group.component';
import { firstValueFrom, Subject } from 'rxjs';
import { ApiServiceService } from '../../../services/api/api-service.service';

export interface DinamicGroupField {
  title: string;              // Título visible del grupo
  style?: GroupStyle;         // Estilos personalizados
  baseFields: FormField[];    // Campos del formulario dinámico
  key?: string;               // Identificador único, útil para condiciones
  relationKey?: string;       // Nombre de la relación en el modelo principal
  addButton?: Button;         // Botón para agregar más registros (solo relaciones 1:N)
  deleteButton?: Button;      // Botón para eliminar registros
  id?: number;                // ID del modelo principal (manejado automáticamente)
  foreign_key: string;        // Llave foránea hacia el modelo principal
  apiUrl: string;             // Endpoint de la API
  valid?: boolean;            // Indica si el subformulario es válido
  initials?: number;          // Cantidad inicial de filas (en nuevos registros)
}

export interface DinamicForm {
  id?: number;
  valid?: boolean;
  loading?: boolean;
  deleteLoading?: boolean;
  fields: FormField[]
}

@Component({
    selector: 'app-dinamic-group-field',
    imports: [
    FormFieldComponent,
    ButtonComponent
],
    templateUrl: './dinamic-group-field.component.html',
    styleUrl: './dinamic-group-field.component.css'
})
export class DinamicGroupFieldComponent implements OnInit, OnChanges {
  private api = inject(ApiServiceService);

  @Input() title!: string
  @Input() style?: GroupStyle
  @Input() baseFields: FormField[] = []
  formRows: DinamicForm[] = []
  @Input() apiUrl!: string
  @Input() disabled? = false

  @Input() addButton?: Button
  @Input() saveButton?: Button
  @Input() deleteButton?: Button

  @Input() foreign_key!: string
  @Input() relationKey?: string
  @Input() id?: number

  @Input() defaultTitleClass = 'h5 fw-bold'
  @Input() defaultBorderClass = 'm-0 my-2 border border-primary'

  @Input() initials = 1

  @Input() valid? = false
  @Output() validChange = new EventEmitter<boolean>()

  @Output() unknownChange = new EventEmitter<void>()
  @Input() dataSource?: unknown[] | null = []

  private _saveCompletedSubject = new Subject<boolean>();
  saveCompleted$ = this._saveCompletedSubject.asObservable();

  ngOnInit() {
    this.setInitialsRows()
    this.setIsValid()
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && this.id !== changes['id'].previousValue && this.id) {
      await this.saveLocalFormRows()
      //obtenemos datos del servidor si no esta definico la relacion o si la relacion viene undefined
      if (!this.relationKey || !this.dataSource) {
        this.setDataSource()
        //de otro modo generamos campos basicos
      } else {
        this.generateForms()
      }
    }
  }

  /**
   * Saves form rows locally if they meet specific conditions.
   *
   * This function iterates through the `formRows` array, filters out forms
   * that do not have an `id` and whose fields are all valid with defined values.
   * It then maps these forms to asynchronous save operations. Once all the save
   * operations complete, it emits a `true` value through the `_saveCompletedSubject`.
   *
   * @returns {Promise<void>} A promise that resolves when all eligible form rows are saved.
   */
  async saveLocalFormRows(): Promise<void> {
    // Filter forms without an ID and with all fields valid and defined, then map them to save operations
    const savePromises = this.formRows
      .filter(
        form =>
          !form.id &&
          form.fields.every(field => field.valid && field.value !== undefined)
      )
      .map(form => this.saveForm(form));

    // Wait for all save operations to complete
    await Promise.all(savePromises);

    // Notify that the save operation is completed
    this._saveCompletedSubject.next(true);
  }

  /**
   * Sets the data source by fetching data from the API based on specific conditions.
   *
   * This function retrieves data from the API, filters it by conditions (e.g., `deleted_at` is `NULL`
   * and matches a foreign key), and assigns the result to `dataSource`. If no data is returned,
   * it updates the validity state and emits a validity change event. Finally, it triggers form generation.
   *
   * @returns {Promise<void>} A promise that resolves once the data source is set and forms are generated.
   */
  async setDataSource(): Promise<void> {
    // Fetch data from the API with conditional filters
    const response = await firstValueFrom(
      this.api.get<unknown>(
        this.apiUrl,
        {
          page:1,
          per_page:99999,
          conditionals: JSON.stringify([
            ['deleted_at', 'IS NULL', 'NULL'],
            [this.foreign_key, '=', this.id]
          ])
        },
        true
      )
    );

    // Assign fetched data to the data source or set an empty array if no data is returned
    this.dataSource = (response.data as unknown[]) ?? [];

    // If no data exists, update the validity state and emit the validChange event
    if (!this.dataSource || this.dataSource.length === 0) {
      this.valid = true;
      this.validChange.emit(true);
    }

    // Generate forms based on the data source
    this.generateForms();
  }

  /**
   * Generates form rows based on the current data source.
   *
   * This function processes each item in the `dataSource`, creates a copy of the base fields,
   * and maps the data from the source into the corresponding form fields. It then updates
   * the `formRows` array with the newly created forms.
   */
  generateForms(): void {
    // Exit if the data source is null or empty
    if (!this.dataSource || this.dataSource.length === 0) return;

    // Initialize the formRows array
    this.formRows = [];

    // Iterate over each row in the data source
    this.dataSource.forEach((row: unknown) => {
      // Create a copy of the base fields
      const newForm = this.copyOf<FormField[]>(this.baseFields);

      // Map values from the row to the corresponding form fields
      const rowRecord = row as Record<string, unknown>;
      Object.keys(rowRecord).forEach(key => {
        const field = newForm.find(f => f.key === key);
        if (field) {
          field.value = rowRecord[key] as string | number | boolean | undefined;
          field.valid = true;
        }
      });

      // Add the generated form to the formRows array
      this.formRows.push({
        id: rowRecord['id'] as number,
        fields: [...newForm]
      });
    });
  }

  /**
   * Initializes form rows with a predefined number of empty forms.
   *
   * This function checks if there are unknown existing `formRows`. If not, it creates
   * a specified number (`initials`) of empty forms by copying the base fields
   * and adds them to `formRows`.
   *
   * @private
   */
  private setInitialsRows(): void {
    // Exit if formRows already contains forms
    if (this.formRows.length > 0) return;

    // Add the initial number of empty forms
    for (let i = this.initials; i > 0; i--) {
      this.formRows.push({
        fields: this.copyOf<FormField[]>(this.baseFields)
      });
    }
  }

  /**
   * Adds a new empty form to the `formRows` array.
   *
   * This function creates a new form by copying the base fields and appends it
   * to the `formRows` array.
   */
  addForm(): void {
    this.formRows.push({
      fields: this.copyOf<FormField[]>(this.baseFields)
    });
  }

  /**
   * Saves the provided form data either by creating a new record or updating an existing one.
   *
   * This function sets the `loading` state of the form to true while the save operation is in progress.
   * If the form has an `id`, it sends a `PUT` request to update the existing record. Otherwise, it sends
   * a `POST` request to create a new record. If a new record is created, the form's `id` is updated with
   * the newly created record's `id`. Once the operation is completed, it resets the `loading` state.
   *
   * @param {DinamicForm} form - The form to be saved.
   * @returns {Promise<void>} A promise that resolves once the form is saved.
   */
  async saveForm(form: DinamicForm): Promise<void> {
    // Set form loading state to true while saving
    form.loading = true;
    const formData = this.formValues(form.fields);

    try {
      // If the form has an id, update the existing record, otherwise create a new record
      if (form.id) {
        await firstValueFrom(this.api.put(this.apiUrl + '/' + form.id, formData, false));
      } else {
        const newRow = (await firstValueFrom(this.api.post<unknown>(this.apiUrl, formData, {}))).data;
        if (newRow) {
          const newRowRecord = newRow as Record<string, unknown>;
          form.id = newRowRecord['id'] as number; // Set the id of the new form
        }
      }
    } finally {
      // Reset form loading state to false after the operation is completed
      form.loading = false;
    }
  }

  /**
   * Deletes the specified form from the `formRows` array.
   *
   * This function checks if the form has a valid `id` and if `id` and `foreign_key` are present.
   * If so, it sends a `DELETE` request to remove the form. Upon successful deletion, the form is
   * removed from the `formRows` array. If no deletion is required, the form is simply removed
   * from the array. The `deleteLoading` state is used to show a loading indicator during the operation.
   *
   * @param {DinamicForm} form - The form to be deleted.
   * @returns {Promise<void>} A promise that resolves once the form is deleted.
   */
  async deleteForm(form: DinamicForm): Promise<void> {
    const index = this.formRows.indexOf(form);
    
    // Exit if the form is not found in formRows
    if (index > -1) {
      if (this.id && this.foreign_key) {
        // Show loading state during deletion
        form.deleteLoading = true;
        
        // Send DELETE request to remove the form
        const res = await firstValueFrom(this.api.delete(this.apiUrl + '/' + form.id, false));
        if (res.status) {
          // Remove the form from the formRows array if deleted successfully
          this.formRows.splice(index, 1);
        }
        
        // Reset delete loading state
        form.deleteLoading = false;
      } else {
        // Remove the form from formRows if no deletion condition is needed
        this.formRows.splice(index, 1);
      }
    }
  }

  /**
   * Extracts values from form fields and maps them to an object.
   *
   * This function iterates over the form fields, extracting the key-value pairs and constructing
   * an object where the keys are the field keys and the values are the corresponding field values.
   * Additionally, it includes a foreign key in the resulting object with the current instance's `id`.
   *
   * @param {FormField[]} form - An array of form fields to extract values from.
   * @returns {unknown} An object representing the form data with field keys as object keys and field values as object values.
   */
  formValues(form: FormField[]): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    // Map field keys and values to the data object
    for (const field of form) {
      data[field.key] = field.value;
    }

    // Add the foreign key to the data object
    data[this.foreign_key] = this.id;

    return data;
  }

  /**
   * Creates a deep copy of the provided object.
   *
   * This function creates a deep copy of the provided object by serializing and then deserializing it.
   * This approach ensures that nested structures are fully copied and not referenced.
   *
   * @param {unknown} form - The object to be copied.
   * @returns {T} A deep copy of the provided object.
   */
  copyOf<T>(form: unknown): T {
    return JSON.parse(JSON.stringify(form)) as T;
  }

  /**
   * Updates a specific field within a form and triggers validation.
   *
   * This function finds the specified field in the form's fields and replaces it with the updated field.
   * After updating the field, it triggers the `setIsValid` function to check the form's validity.
   *
   * @param {FormField} updatedField - The updated field data.
   * @param {DinamicForm} form - The form containing the field to be updated.
   * @param {FormField} field - The field to be updated.
   */
  onFieldChange(updatedField: FormField, form: DinamicForm, field: FormField): void {
    const fieldIndex = form.fields.indexOf(field);
    
    // Update the field if found
    if (fieldIndex > -1) {
      form.fields[fieldIndex] = updatedField;
      this.setIsValid(); // Trigger validation after updating
    }
  }

  /**
   * Validates the form by checking if all fields in all forms are valid.
   *
   * This function checks whether every field in every form is valid. If all fields are valid, the
   * `valid` property is set to `true`, and a change event is emitted. Otherwise, it sets `valid` to `false`.
   */
  setIsValid(): void {
    this.valid = this.formRows.every((form) =>
      form.fields.every((field) => field.valid)
    );
    
    // Emit validity change event
    this.validChange.emit(this.valid);
  }
}
