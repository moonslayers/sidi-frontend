
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChildren, inject, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from "./form-group/form-group.component";
import { Button, ButtonComponent } from "../button/button.component";
import { FieldTypesService } from './form-field/field-types.service';
import { FormField, BasicInput, FormFieldComponent } from './form-field/form-field.component';
import { DinamicGroupField, DinamicGroupFieldComponent } from './dinamic-group-field/dinamic-group-field.component';
import { OrderableList, OrderableListComponent } from './orderable-list/orderable-list.component';
import { FormFieldGroupComponent } from "./form-field-group/form-field-group.component";
import { SuperService } from '../../controllers/super.service';
import { UtilsService } from '../../services/utils.service';
import { MapField, MapFieldComponent } from "./map-field/map-field.component";
import { FileInput, FileInputComponent } from '../file-input/file-input.component';
import { combineLatest, firstValueFrom, Observable } from 'rxjs';
import { GenericFormService } from './generic-form.service';
import { ToastService } from '../../services/toast.service';

export interface FormConditional {
  key: string;
  operator: '==' | '===' | '!=' | '!==' | '<' | '<=' | '>' | '>=';
  value: string | undefined | null;
  target: string;
  targetAction: 'hide' | 'unhide' | 'disabled';
}

export type GenericRecord = Record<string, unknown>;

export interface Validator {
  required?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  regex?: RegExp | string;
  disabled?: boolean;
}

export type Form = FormElement[]


export type FormElement = (FormGroup | FormField | DinamicGroupField | OrderableList | MapField | FileInput) & { hidden?: boolean; }

@Component({
  selector: 'app-generic-form',
  imports: [
    ButtonComponent,
    FormFieldComponent,
    DinamicGroupFieldComponent,
    OrderableListComponent,
    FormFieldGroupComponent,
    MapFieldComponent,
    FileInputComponent
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
/**
 * GenericFormComponent is a dynamic form component used to render and manage a form with various configurations.
 * It supports conditional logic, form validation, and custom button actions.
 */
export class GenericFormComponent<T = unknown> implements OnInit, OnChanges {
  fieldTypes = inject(FieldTypesService);
  private formService = inject(GenericFormService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private utils = inject(UtilsService);


  /**
   * Service used to manage the form's data and behavior.
   */
  @Input() controller!: SuperService<T>;

  /**
   * Title of the form.
   */
  @Input() title = '';

  /**
   * Form array containing form fields or other form components.
   */
  @Input() form: Form = [];

  /**
   * Event emitted when the form data changes.
   */
  @Output() formChange = new EventEmitter<Form>();

  /**
   * Values typed from user at unknown time
   */
  @Input() values?: Partial<T>;

  /**
   * Event emitted when the values of the form change.
   */
  @Output() valuesChange = new EventEmitter<T>();

  /**
   * Optional validator to be applied to the form.
   */
  @Input() validator?: Validator;

  /**
   * List of conditional rules applied to the form fields.
   */
  @Input() conditionals: FormConditional[] = [];

  /**
   * Optional data to pre-populate the form for editing, changes on submit
   */
  @Input() edit?: T & GenericRecord;

  /**
   * Optional values to fill inputs
   */
  @Input() editFill?: Partial<T & GenericRecord>;

  /**
   * Original Values of the record to edit
   */
  @Input() originalEdit?: T & GenericRecord

  /**
   * Emits the data updated a partial Model with just the keys to be updated
   */
  @Output() updatedData = new EventEmitter<Partial<T>>()

  /**
   * Event emitted when the edited data changes.
   */
  @Output() editChange = new EventEmitter<T>();

  /**
   * Flag to determine if the form should use small form layout.
   * Default is `false`.
   */
  @Input() sm = false;

  /**
   * Default CSS class for form input divs.
   */
  @Input() defaultInputDivClass = 'col-12 col-sm-6 col-md-4 p-3';

  /**
   * Default CSS class for form titles.
   */
  @Input() defaultTitleClass = 'h5 fw-bold';

  /**
   * Default CSS class for form borders.
   */
  @Input() defaultBorderClass = 'm-0 my-2 border border-primary';

  /**
   * CSS class for the row containing buttons.
   */
  @Input() rowButtonClass = "row mt-1";

  /**
   * Text for the submit button.
   */
  @Input() submitText = 'Guardar';

  /**
   * CSS class for the submit button.
   */
  @Input() buttonClass = 'btn btn-primary';

  /**
   * Optional CSS class for the row container.
   */
  @Input() rowClass?: string;

  /**
   * Flag to determine if the form should include a submit button row.
   * Default is `false`.
   */
  @Input() rowSubmit = false;

  /**
   * Custom button configuration for the submit button.
   */
  @Input() rowSubmitButton?: Button = {
    style: {
      div: 'col-auto p-3 align-self-end'
    },
    text: 'Guardar'
  };

  /**
   * Flag to determine if the form should include a delete button row.
   * Default is `false`.
   */
  @Input() rowDelete = false;

  /**
   * Custom button configuration for the delete button.
   */
  @Input() rowDeleteButton?: Button = {
    style: {
      div: 'col-auto p-3 align-self-end'
    },
    text: 'Eliminar'
  };

  /**
   * Flag to determine if the form should include an extra button row.
   * Default is `false`.
   */
  @Input() rowExtra = false;

  /**
   * Custom button configuration for the extra button.
   */
  @Input() rowExtraButton?: Button = {
    style: {
      div: 'col-auto p-3 align-self-end'
    },
    text: 'Extra'
  };

  /**
   * Event emitted when the extra button is clicked.
   */
  @Output() rowExtraEvent = new EventEmitter<void>();

  /**
   * Indicates whether the form is valid.
   */
  @Input() valid? = false;

  /**
   * Event emitted when the validity of the form changes.
   */
  @Output() validChange = new EventEmitter<boolean>();

  /**
   * Key to identify the primary field for the form data.
   */
  @Input() idKey = 'id';

  /**
   * Extra data associated with the form, which is a partial record of the form and generic data.
   */
  @Input() formExtra: Partial<T & GenericRecord> = {};

  /**
   * Determines if the form is isolated (not static), in which case two-way binding is not used.
   * Default is `true`.
   */
  @Input() isolatedForm = true;

  /** Determines if the record will be saved otherwise edit will be emitted */
  @Input() localForm = false

  /** Determines if the form is disabeld */
  @Input() disabled = false

  /**
   * Determines if the button should be enabled. The default value is `true`
   */
  @Input() isBotonGuardarEnabled? = true;

  /**
   * Reference to the dynamic form components that can be accessed and manipulated.
   */
  @ViewChildren('dinamycForm') dinamycForms?: DinamicGroupFieldComponent[];

  /**
   * Map of operator strings to their corresponding comparison functions.
   */
  operatorFunctions: Record<string, (a: unknown, b: unknown) => boolean> = {
    '==': (a, b) => a == b,
    '===': (a, b) => a === b,
    '!=': (a, b) => a != b,
    '!==': (a, b) => a !== b,
    '<': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a < b;
      return false;
    },
    '<=': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a <= b;
      return false;
    },
    '>': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a > b;
      return false;
    },
    '>=': (a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return a >= b;
      return false;
    },
  };

  /**
   * Lifecycle hook that is called when the component is initialized.
   * Logs the initial form data.
   */
  ngOnInit(): void {
    console.log(this.form);
  }

  // Helper methods for template type safety
  getIdForFileInput(): string | undefined {
    if (!this.edit || !this.edit[this.idKey]) return undefined;
    const editRecord = this.edit as GenericRecord;
    const id = editRecord[this.idKey];
    return id?.toString();
  }

  getIdForDinamicGroup(): number | undefined {
    if (!this.edit || !this.edit[this.idKey]) return undefined;
    const editRecord = this.edit as GenericRecord;
    const id = editRecord[this.idKey];
    return typeof id === 'number' ? id : undefined;
  }

  getRelationData(field: DinamicGroupField): unknown[] | null | undefined {
    if (!this.edit || !field.relationKey) return undefined;
    const editRecord = this.edit as GenericRecord;
    const data = editRecord[field.relationKey];
    if (Array.isArray(data)) return data;
    return undefined;
  }

  getOrderableListValue(field: OrderableList): string | string[] | undefined {
    if (typeof field.value === 'string') return field.value;
    if (Array.isArray(field.value) && field.value.every(item => typeof item === 'string')) {
      return field.value as string[];
    }
    return undefined;
  }

  setOrderableListValue(field: OrderableList, value: string | string[] | undefined): void {
    field.value = value;
  }

  /**
   * Lifecycle hook that is called when input properties change.
   * 
   * @param changes An object containing changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['edit'] && changes['edit'].previousValue !== this.edit && this.edit) {
      this.setValuesFromEdit();
      this.setOriginalValuesFromEdit();
    }

    if (changes['editFill'] && this.editFill) {
      console.info(this.editFill)
      this.fillEdit()
    }

    if (changes['form'] && this.isolatedForm) {
      this.form = this.utils.copyOf(this.form);
    }

    if (changes['conditionals'] || changes['edit']) {
      this.checkConditionals();
    }

    if (changes['validator'] || changes['form'] || changes['disabled']) {
      this.setGlobalValidator();
    }

    if (changes['form']) {
        this.setIsValid();
    }
  }

  private fillEdit() {
    if (!this.editFill || !this.edit) return;
    this.edit = this.parsedData();
    const editRecord = this.edit as Record<string, unknown>;
    for (const key of Object.keys(this.editFill)) {
      editRecord[key] = this.editFill[key];
    }
    this.setValuesFromEdit()
  }

  /**
   * Evaluates the visibility and disabled state of form elements based on conditional logic.
   *
   * This function iterates through the form and applies the conditional rules for hiding or disabling fields. 
   * It checks if there are unknown conditionals defined and applies them accordingly to the form elements.
   * It also updates the `hidden` and `validator.disabled` properties of the fields based on the conditional logic.
   */
  checkConditionals(): void {
    if (!this.conditionals.length) return;

    for (const formElement of this.form) {
      formElement.hidden = this.isHidden(formElement);

      if (this.fieldTypes.isFormGroup(formElement)) {
        formElement.hidden = this.isGroupHidden(formElement)
        for (const field of formElement.fields) {
          field.hidden = this.isHidden(field);
          field.validator = {
            ...field.validator ?? {},
            disabled: this.disabled === true ? true : this.isDisabled(field),
          };
        }
      }

      if (this.fieldTypes.isDinamicGroupField(formElement)) {
        formElement.hidden = this.isGroupHidden(formElement)
      }
    }

  }

  /**
   * Determines if a form group or dynamic group field should be hidden based on conditional logic.
   *
   * This function checks if there is a conditional rule targeting the group's title. If such a rule exists,
   * it evaluates whether the group should be hidden by comparing the value of the referenced field with the
   * conditional value. If the values match, the group is hidden.
   *
   * @param formGroup - The form group or dynamic group field to evaluate.
   * @returns `true` if the group should be hidden, `false` otherwise.
   */
  private isGroupHidden(formGroup: FormGroup | DinamicGroupField): boolean {
    const conditional = this.findConditionalForGroup(formGroup);
    if (!conditional) return false;

    const referencedField = this.getReferencedField(conditional);
    if (!referencedField) return false;

    return this.shouldHideGroup(conditional, referencedField);
  }

  /**
   * Finds the conditional rule targeting the group's title.
   *
   * @param formGroup - The form group or dynamic group field to evaluate.
   * @returns The conditional rule if found, otherwise `undefined`.
   */
  private findConditionalForGroup(formGroup: FormGroup | DinamicGroupField): FormConditional | undefined {
    return this.conditionals.find((cond) => cond.target === formGroup.title);
  }

  /**
   * Retrieves the referenced field in the form based on the conditional rule.
   *
   * @param conditional - The conditional rule to evaluate.
   * @returns The referenced form field if found, otherwise `undefined`.
   */
  private getReferencedField(conditional: FormConditional): FormField | undefined | null {
    return this.fieldTypes.getFormFieldByKey(this.form, conditional.key);
  }

  /**
   * Determines if the group should be hidden based on the conditional rule and the referenced field's value.
   *
   * @param conditional - The conditional rule to evaluate.
   * @param referencedField - The referenced form field.
   * @returns `true` if the group should be hidden, `false` otherwise.
   */
  private shouldHideGroup(conditional: FormConditional, referencedField: FormField): boolean {
    return referencedField.value === conditional.value;
  }

  /**
   * Determines if a field should be disabled based on conditional logic.
   *
   * This function checks the conditionals for a specific field and evaluates whether the field
   * should be disabled. If the field is disabled, its value is cleared. It uses an evaluator function
   * to compare the field's value with the conditional value.
   *
   * @param field - The form field to evaluate.
   * @returns `true` if the field should be disabled, `false` otherwise.
   */
  private isDisabled(field: FormElement): boolean {
    if (!this.conditionals.length) return false;
    if (!field.key) return false;

    const conditional = this.conditionals.find((cond) => cond.target === field.key);
    if (!conditional) return false;

    const main = this.fieldTypes.getFormFieldByKey(this.form, conditional.key);
    if (main) {
      const evaluator = this.operatorFunctions[conditional.operator];

      if (conditional.targetAction === 'disabled') {
        const value = evaluator(conditional.value, main.value);
        if (value && this.fieldTypes.isFormField(field)) {
          field.value = undefined;
        }
        return value;
      }
    }
    return false;
  }

  /**
   * Determines if a field should be hidden based on conditional logic.
   *
   * This function checks the conditionals for a specific field and evaluates whether the field
   * should be hidden. It uses an evaluator function to compare the field's value with the conditional value.
   *
   * @param field - The form field to evaluate.
   * @returns `true` if the field should be hidden, `false` otherwise.
   */
  isHidden(field: FormElement): boolean {
    if (!this.conditionals.length) return false;
    if (!field.key) return false;

    const conditional = this.conditionals.find((cond) => cond.target === field.key);
    if (!conditional) return false;

    const main = this.fieldTypes.getFormFieldByKey(this.form, conditional.key);
    if (main) {
      const evaluator = this.operatorFunctions[conditional.operator];

      if (conditional.targetAction === 'hide') {
        return evaluator(conditional.value, main.value);
      }
      if (conditional.targetAction === 'unhide') {
        return !evaluator(conditional.value, main.value);
      }
    }
    return false;
  }

  /**
   * Sets the global validator for all form fields.
   *
   * This function iterates through the form and assigns a global validator to each form field, 
   * form group, and dynamic group field. If a field already has its own validator, the global
   * validator is merged with the existing one. If the field doesn't have a validator, the global 
   * validator is assigned as the field's validator.
   */
  setGlobalValidator(): void {
    this.form.forEach((field) => {
      // Apply the global validator to FormGroups
      if (this.fieldTypes.isFormGroup(field)) {
        field.fields.forEach((innerField) => {
          innerField.validator = { ...this.validator, ...field.validator, ...innerField.validator };
          if (this.disabled) {
            innerField.validator.disabled = true
          }
        });
      }

      // Apply the global validator to FormFields
      if (this.fieldTypes.isFormField(field)) {
        if (field.validator) {
          field.validator = { ...this.validator, ...field.validator, };
        } else {
          field.validator = this.validator;
        }
        if(!field.validator){
          field.validator={}
        }
        if (this.disabled) {
          field.validator.disabled = true
        }
      }

      // Apply the global validator to DynamicGroupFields
      if (this.fieldTypes.isDinamicGroupField(field)) {
        field.baseFields.forEach((innerField) => {
          if (innerField.validator) {
            innerField.validator = { ...this.validator, ...innerField.validator, };
          } else {
            innerField.validator = this.validator;
          }
          if(!innerField.validator){
            innerField.validator={}
          }
          if (this.disabled) {
            innerField.validator.disabled = true
          }
        });
      }
    });
  }

  /**
   * Resets the form by clearing the values and setting all fields as valid.
   *
   * This function iterates through the form and clears the values of each field, while also setting their validity to true.
   * It handles both form groups and individual form fields, ensuring that all fields are reset correctly.
   * It then emits the updated form state and triggers a validity change event.
   */
  cleanForm(): void {
    for (const field of this.form) {
      if (this.fieldTypes.isFormGroup(field)) {
        // Si es un FormGroup, iterar sobre sus campos
        field.fields.forEach((innerField) => {
          innerField.value = undefined;
          innerField.valid = true;
        });
      } else if (this.fieldTypes.isFormField(field)) {
        // Si no es un campo dinámico, asignar directamente el valor
        field.value = undefined;
        field.valid = true;
      }
    }

    console.log("EDITADO EDIT", this.form);
    this.validChange.emit(true);
    this.formChange.emit(this.form);
  }

  /**
   * Sets the form values by parsing the data and emitting a values change event.
   *
   * This function parses the form data and assigns it to the `values` property. It then emits a change event
   * to notify other components about the updated values.
   */
  setValues(): void {
    this.values = this.parsedData();
    this.valuesChange.emit(this.parsedData());
  }

  /**
   * Sets the form values based on the `edit` object.
   *
   * This function iterates over the form fields and assigns the corresponding values from the `edit` object.
   * If `edit` is not defined, it cleans the form. It also triggers validity checks and emits change events.
   */
  setValuesFromEdit(): void {
    // Validar si `edit` está definido antes de continuar
    if (!this.edit) {
      this.cleanForm();
      return;
    }
    this.formService.setValuesFromModel(this.form, this.edit)

    console.log("EDITADO EDIT", this.form);
    this.validChange.emit(true);
    this.formChange.emit(this.form);
  }

  /**
   * Sets the original values of the form based on the `edit` object.
   *
   * This function creates a deep copy of the `edit` object and assigns it to `originalEdit`.
   * The `originalEdit` property is used to store the initial state of the form when editing an existing record.
   * If the `edit` object is not defined, the function exits early without making unknown changes.
   *
   * @returns {void}
   */
  private setOriginalValuesFromEdit(): void {
    // Exit early if `edit` is not defined
    if (!this.edit) return;

    // Create a deep copy of the `edit` object and assign it to `originalEdit`
    this.originalEdit = this.utils.copyOf(this.edit);
  }

  /**
   * Handles the change of a form field value and updates the form.
   *
   * This function updates the specific field in the form and emits the updated form.
   * It also triggers additional actions like setting values, checking conditionals, and validating the form.
   *
   * @param updatedField The updated form field.
   * @param form The form to which the field belongs.
   * @param field The original form field that was updated.
   */
  onFieldChange(updatedField: FormField, form: Form, field: FormField): void {
    const fieldIndex = form.indexOf(field);
    if (fieldIndex > -1) {
      form[fieldIndex] = updatedField;
      this.formChange.emit(this.form);
      this.setValues();
      this.checkConditionals();
      this.setIsValid();
    }
  }

  /**
   * Updates the form's validity status, emits changes, and triggers additional actions.
   *
   * This function sets the form's validity based on the result of `isValidForm()`, emits the validity change event, 
   * updates form values, checks conditionals, and triggers change detection.
   */
  setIsValid(): void {
    this.valid = this.isValidForm();
    this.validChange.emit(this.valid);
    this.setValues();
    this.checkConditionals();
    this.cdr.detectChanges();
  }

  /**
   * Checks if all fields in the form are valid.
   *
   * @returns {boolean} `true` if all fields are valid, otherwise `false`.
   */
  isValidForm(): boolean {
    return this.form.every((field) => field.valid);
  }

  /**
   * Deletes the current form data and triggers necessary actions.
   *
   * If the current edit record exists and has a valid ID, this function calls `switch` on the controller to handle the deletion,
   * emits an undefined value for the edit change, and cleans up the form.
   */
  async deleteData(): Promise<void> {
    if (!this.edit || !this.edit[this.idKey]) return;

    const editRecord = this.edit as GenericRecord;
    const id = editRecord[this.idKey];
    if (typeof id === 'number') {
      await this.controller.switch(id);
      this.editChange.emit(undefined);
      this.cleanForm();
    }
  }

  /**
   * Submits data based on whether the entity is being edited or created as a new record.
   *
   * This function first checks if the entity is being edited by verifying the presence of an `id` in the `edit` object.
   * If editing, it updates the existing record by calling the `update` method of the controller with the entity's `id`
   * and the parsed data. Upon successful update, it submits dynamic forms and updates the `edit` object with the new data.
   * If the entity is not being edited, it creates a new record by calling the `new` method of the controller with the parsed data,
   * waits for all dynamic forms to save, and then emits the updated `edit` object.
   *
   * @returns {Promise<void>} A promise that resolves once the data is successfully submitted.
   */
  async submitData(): Promise<void> {
    // Check if the entity is being edited
    if (this.edit && this.edit[this.idKey]) {
      const id = (this.edit as GenericRecord)[this.idKey];

      const dataToUpdate = this.toUpdateParsedData()

      if (!this.isSomethingToUpdate()) {
        this.toast.show({
          title: 'Información',
          message: 'No hay nada que actualizar.',
        })
        return;
      }

      // Update existing record
      const res = await this.controller.update(id as number, dataToUpdate as Partial<T>);
      if (res.status) {
        await this.submitDinamycForms(); // Submit dynamic forms if update is successful
        this.edit = this.parsedData(); // Update the edit object with the parsed data
        this.setOriginalValuesFromEdit(); // Update new originals values after changes
        this.updatedData.emit(dataToUpdate);
        this.editChange.emit(this.edit); // Emit the updated edit object
      }
      return; // Exit if the entity is being edited
    }
    //If form is being using just in local we emit the record with values and thats it.
    if (this.localForm) {
      this.edit = this.parsedData<T & GenericRecord>()
      this.editChange.emit(this.parsedData<T & GenericRecord>())
      return
    }

    // Create new record if not being edited
    this.edit = await this.controller.new(this.parsedData<T>()) as (T & GenericRecord);

    // Wait for all dynamic forms to save
    await this.untilAllDinamicFormsSaves();

    // Emit the newly created edit object
    this.editChange.emit(this.edit);
  }

  /**
   * Determines if there are unknown changes to update in the form data.
   *
   * This function checks if there are unknown fields in the form that have been modified compared to the original data.
   * It uses the `toUpdateParsedData` method to generate a partial object containing only the fields that have changed.
   * If the resulting object has unknown keys, it means there are changes to update.
   *
   * @returns {boolean} `true` if there are changes to update, otherwise `false`.
   */
  isSomethingToUpdate(): boolean {
    // Step 1: Generate a partial object containing only the fields that have changed
    const dataToUpdate = this.toUpdateParsedData();

    // Step 2: Retrieve the keys of the changed fields
    const keys = Object.keys(dataToUpdate);

    // Step 3: Check if there are unknown keys (i.e., changes) and return the result
    return keys.length > 0;
  }

  /**
   * Generates a partial object containing only the fields that have changed between the current form data and the original edit data.
   *
   * This function compares the current form data (`parsedData`) with the original edit data (`originalEdit`). It creates a new object
   * (`dataToUpdate`) that includes only the fields where the values differ between the two datasets. This is useful for optimizing
   * updates by sending only the changed fields to the backend, reducing unnecessary data transfer.
   *
   * @template T The type of the form data.
   * @returns {Partial<T & GenericRecord>} A partial object containing only the fields that have changed.
   */
  private toUpdateParsedData(): Partial<T & GenericRecord> {
    // Step 1: Parse the current form data into a partial object of type T & GenericRecord
    const currentData = this.parsedData<Partial<T & GenericRecord>>();

    // Step 2: If there is no original edit data, return the current data as is
    if (!this.originalEdit) return currentData;

    // Step 3: Initialize an empty object to store the fields that have changed
    const dataToUpdate: Record<string, unknown> = {};

    // Step 4: Iterate through the keys of the current data
    for (const key of Object.keys(currentData)) {
      // Step 5: Compare the current value with the original value
      if (currentData[key] != this.originalEdit[key] && currentData[key] !== undefined) {
        // Step 6: If the values differ, add the field to the `dataToUpdate` object
        dataToUpdate[key] = currentData[key];
      }
    }

    // Step 7: Return the object containing only the changed fields
    return dataToUpdate as Partial<T & GenericRecord>;
  }

  /**
   * Waits for all dynamic forms to finish saving.
   *
   * This function checks if there are dynamic forms to process. If they exist, it creates an array of observables
   * from the `saveCompleted$` property of each dynamic form component. Then, it combines all these observables and waits
   * for all of them to emit a value, indicating that the save operation is complete for all forms.
   *
   * @returns {Promise<void>} A promise that resolves once all dynamic forms have completed saving.
   */
  async untilAllDinamicFormsSaves(): Promise<void> {
    if (!this.dinamycForms) return;

    if (this.dinamycForms.length == 0) return;

    // Create an array of observables from each form component's saveCompleted$ stream
    const saveCompletedObservables: Observable<boolean>[] = this.dinamycForms.map(
      (formComponent) => formComponent.saveCompleted$
    );

    // Combine all observables and wait for all to emit
    await firstValueFrom(combineLatest(saveCompletedObservables));
  }

  /**
   * Submits all dynamic forms by saving their rows.
   *
   * This function checks if dynamic forms exist and, if so, uses `Promise.all` to wait for all save operations
   * of the form rows to complete. Each dynamic form's `saveLocalFormRows` method is called to initiate the save process.
   *
   * @returns {Promise<void>} A promise that resolves once all dynamic forms have completed their save operations.
   */
  async submitDinamycForms(): Promise<void> {
    if (this.dinamycForms) {
      // Use Promise.all to wait for all save operations to resolve
      await Promise.all(this.dinamycForms.map(df => df.saveLocalFormRows()));
    }
  }

  /**
   * Parses the form data and returns it as an object of type T.
   *
   * This function processes the form, extracting values from basic input fields, form groups, extra fields, and map fields.
   * It then compiles these values into a `formData` object and returns it as the specified type T.
   * If an `edit` object exists, its `id` is included in the returned data.
   *
   * @template T The type to which the form data is mapped.
   * @returns {T} An object containing the parsed form data.
   */
  parsedData<T>(): T {
    const formData: Record<string, unknown> = {};

    // Filter and collect basic input fields
    const fields: BasicInput[] = this.form.filter((field) => this.fieldTypes.isBasicInput(field)) as BasicInput[];

    // Process form groups and their nested fields
    (this.form.filter((field) => this.fieldTypes.isFormGroup(field)) as FormGroup[])
      .forEach((group) => {
        group.fields.forEach((field) => {
          fields.push({
            key: field.key,
            value: field.value?.toString(),
          });
        });
      });

    // Add all fields to formData
    for (const field of fields) {
      formData[field.key] = field.value;
    }

    // If editing, add the id from the edit object
    if (this.edit && this.edit[this.idKey]) {
      formData[this.idKey] = this.edit[this.idKey];
    }

    // Add extra form data
    for (const key of Object.keys(this.formExtra)) {
      formData[key] = this.formExtra[key];
    }

    // Process map fields and add their latitude and longitude values
    const maps = this.form.filter((field) => this.fieldTypes.isMapField(field) && !field.hidden) as MapField[];
    maps.forEach((map) => {
      formData[map.latitud.key] = map.latitud.value;
      formData[map.longitud.key] = map.longitud.value;
    });

    return formData as T;
  }

  /**
   * Returns a list of invalid field labels from the form.
   *
   * This function iterates through all the fields in the form, checking whether they are valid. If unknown field is invalid, 
   * it adds the field's label (or a formatted version of the field's key if no label exists) to the `invalidFields` array.
   * It checks for regular form fields, form groups, and dynamic group fields.
   *
   * @returns {string[]} An array of labels for the invalid fields in the form.
   */
  invalidFields(): string[] {
    const invalidFields: string[] = [];

    // Iterate through form fields and check validity
    this.form.forEach((field) => {
      if (this.fieldTypes.isFormField(field) && !field.valid) {
        invalidFields.push(this.fieldLabel(field));
      }

      // Check validity of fields within form groups
      if (this.fieldTypes.isFormGroup(field)) {
        field.fields.forEach((innerField) => {
          if (!innerField.valid) invalidFields.push(this.fieldLabel(innerField));
        });
      }

      // Check validity of fields within dynamic group fields
      if (this.fieldTypes.isDinamicGroupField(field)) {
        field.baseFields.forEach((innerField) => {
          if (!innerField.valid) invalidFields.push(this.fieldLabel(innerField));
        });
      }
    });

    return invalidFields;
  }

  /**
   * Retrieves the label for a given field. If no label is provided, it returns a formatted version of the field's key.
   *
   * The label is either the field's `label` property or the field's `key` property formatted by replacing underscores with spaces and converting to lowercase.
   *
   * @param {FormField} field The field for which to retrieve the label.
   * @returns {string} The label of the field, or a formatted version of the key if no label exists.
   */
  private fieldLabel(field: FormField): string {
    return field.label ?? (field.key.replaceAll('_', ' ')).toLowerCase();
  }
}
