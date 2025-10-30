import { Component } from '@angular/core';
import { Form, GenericFormComponent } from '../../../shared/generic-form/generic-form.component';

interface FormularioInhibidoresFormDefinition {
    title: string
    forms: Form[]
}



    const FORM_DEFINITION: FormularioInhibidoresFormDefinition = 
    {
      title: "Inhibidores",
      forms: [
        [
          {
            title: "Seccion A",
            fields:[
              {
                key: "nombre_empresa",
                label: "Nombre de empresa",
                type: "text"
              }          
            ]
          }
        ],
        [
          {
            title: "Seccion B",
            fields: [
              {
                key: "test",
                label: "test",
                type: "text"
              }
            ]
          }
        ]
      ]
    }
/* {
  title: 'Datos Generales',
  fields: [
    {
      key: 'tipo_empresa',
      label: 'Tipo de Empresa',
      options: ['INDUSTRIA', 'AGROINDUSTRIA', 'COMERCIO', 'SERVICIOS', 'NO DEFINIDO'],
    },
    {
      key: 'nombre',
      label: 'Nombre Comercial',
      type: 'text'
    },
    {
      key: 'calle',
      label: 'Calle',
      type: 'text',
    },
    {
      key: 'no_exterior',
      label: 'No. exterior',
      type: 'text',
    },
    {
      key: 'no_interior',
      label: 'No. Interior',
      type: 'text',
      defaultValue: '',
      validator: {
        required: false,
      }
    },
    {
      key: 'localidad',
      label: 'Localidad',
      type: 'text',
    },
    {
      key: 'codigo_postal',
      label: 'Codigo Postal',
      type: 'number',
      validator: {
        min: 0,
      },
    },
    {
      key: 'colonia',
      label: 'Colonia',
      type: 'text'
    },
    {
      key: 'ciudad_id',
      keyList: 'id',
      keyDetalle: 'nombre',
      label: 'Ciudad',
      apiUrl: 'api/ciudades',
      extraData: {
        busqueda_avanzada: JSON.stringify([
          {
            relation: 'estados',
            conditionals: [
              ['nombre', '=', 'BAJA CALIFORNIA'],
              ['nombre', '=', 'baja california']
            ],
            andConditionals: [],
          } as AdvancedSearchFilter
        ])
      },
    },
    {
      key: 'resumen_actividad_empresarial',
      type: 'text',
      label: 'Resumen Actividad Empresarial',
      validator: {
        required: true,
      },
      style: {
        div: 'col-12 col-sm p-3'
      }
    },
    {
      key: 'referencia_domicilio',
      type: 'text',
      label: 'Referencias Domicilio',
      validator: {
        required: false,
      },
      style: {
        div: 'col-12 col-sm p-3'
      }
    }
  ]
},
{
  title: 'Domicilio en el Mapa',
  key: 'mapField',
  latitud: {
    key: 'latitud'
  },
  longitud: {
    key: 'longitud'
  },
},
{
  title: 'Datos de Empleos',
  fields: [
    {
      key: 'empleos_informales_mujeres',
      label: 'Empleos Informales Mujeres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_informales_hombres',
      label: 'Empleos Informales Hombres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_informales_no_binarios',
      label: 'Empleos Informales No Binarios',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_imss_mujeres',
      label: 'Empleos IMSS Mujeres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_imss_hombres',
      label: 'Empleos IMSS Hombres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_imss_no_binarios',
      label: 'Empleos IMSS No Binarios',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_a_generar_mujeres',
      label: 'Empleos a generar Mujeres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_a_generar_hombres',
      label: 'Empleos a generar Hombres',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
    {
      key: 'empleos_a_generar_no_binarios',
      label: 'Empleos a generar No Binarios',
      defaultValue: 0,
      validator: {
        min: 0,
      },
      type: 'number'
    },
  ]
},
{
  title: 'Datos Otros',
  fields: [
    {
      key: 'inicio_operaciones',
      label: 'Fecha Inicio Operaciones',
      type: 'date',
      validator:{required:false},
    },
    {
      key:'fuente_informacion',
      label:'¿Dónde te enteraste del Crédito?',
      options:['JORNADA','OFICINA', 'PROSPECCION','REDES SOCIALES','CAMARAS',],
      style:{
        div:'col-12 col-sm p-3'
      },
      validator:{
        required:true,
      }
    },
    {
      key: 'detalle_camara',
      label: 'Siglas Camara',
      type: 'text',
      validator:{required:false},
    },Seccion A
  ]
},
{
  title: 'Actividades Economicas',
  apiUrl: 'api/negocios_actividades_economicas',
  relationKey: 'negocios_actividades_economicas',
  foreign_key: 'negocio_id',
  baseFields: [
    {
      key: 'actividades_economica_id',
      apiUrl: 'api/actividades_economicas',
      keyList: 'id',
      keyDetalle: 'subgrupo',
      label: 'Actividad',
      function: (actividad: ActividadEconomica) => {
        return actividad.clave + ' - ' + actividad.subgrupo.toUpperCase()
      }
    },
  ]
}, */



@Component({
  selector: 'app-formulario-inhibidores-form',
  imports: [GenericFormComponent],
  templateUrl: './formulario-inhibidores-form.html'  
})
export class FormularioInhibidoresForm {
    form = FORM_DEFINITION
}
