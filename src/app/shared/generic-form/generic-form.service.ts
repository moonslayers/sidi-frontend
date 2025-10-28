import { Injectable, inject } from '@angular/core';
import { Form, GenericRecord } from './generic-form.component';
import { FieldTypesService } from './form-field/field-types.service';

@Injectable({
  providedIn: 'root'
})
export class GenericFormService {
  private fieldTypes = inject(FieldTypesService);


  setValuesFromModel(form:Form,model:unknown): void {
    // Validar si `edit` está definido antes de continuar
    if (!model) {
      return;
    }

    // Obtener las claves del objeto `edit`
    const keys = Object.keys(model as GenericRecord);

    for (const key of keys) {
      form.forEach((field) => {
        if (this.fieldTypes.isFormGroup(field)) {
          // Si es un FormGroup, iterar sobre sus campos
          field.fields.forEach((innerField) => {
            if (innerField.key === key) {
              innerField.value = (model as GenericRecord)[key] as string | number | boolean | undefined;
              innerField.valid = true;
            }
          });
        } else if (this.fieldTypes.isMapField(field)) {
          if (key.includes('latitud')) field.latitud.value = (model as GenericRecord)[key] as number | undefined;
          if (key.includes('longitud')) field.longitud.value = (model as GenericRecord)[key] as number | undefined;
        } else if (this.fieldTypes.isFormField(field) || this.fieldTypes.isFileInput(field)) {
          // Si no es un campo dinámico, asignar directamente el valor
          if (field.key === key) {
            field.value = (model as GenericRecord)[key] as string | number | boolean | undefined;
            field.valid = true;
          }
        }
      });
    }
  }
}
