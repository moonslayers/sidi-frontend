import { Component } from '@angular/core';
import { Form, FormConditional, GenericFormComponent } from '../../../shared/generic-form/generic-form.component';

interface FormularioInhibidoresFormDefinition {
    title: string
    forms: Form[]
}

//TODO: Cuando el usuario seleccione de la sección A pregunta 8, la opción 62, hacer el campo 9 opcional
//Probar sección A
//Terminar sección B
//Terminar sección C
//Crear componentes de inputs nuevos:
// - Selector multiple, poder seleccionar varias opciones de un selector

const FORM_DEFINITION: FormularioInhibidoresFormDefinition = 
{
  title: "Inhibidores",
  forms: [
    [
      {
        title: "Sección A: Información de Identificación",
        fields: [
          { 
            key: 'nombre_empresa', 
            label: '1. Nombre de la empresa', 
            placeholder: 'Nombre de la empresa',
            type: 'text', 
            validator: { required: true } },
          { 
            key: 'nombre_solicitante', 
            label: '2. Nombre del solicitante', 
            placeholder: 'Nombre del solicitante',
            type: 'text', 
            validator: { required: true } },
          { 
            key: 'puesto_solicitante', 
            label: '3. Puesto o cargo del solicitante dentro de la empresa', 
            placeholder: 'Puesto o cargo del solicitante',
            type: 'text', 
            validator: { required: true } },
          { 
            key: 'email_solicitante', 
            label: '4. Correo electrónico del solicitante', 
            placeholder: '4. Correo electrónico del solicitante',
            type: 'email', 
            validator: { required: true, email: true } 
          },
          { 
            key: 'municipio', 
            label: '5. Municipio',             
            placeholder: 'Municipio',
            options: ['Ensenada', 'Mexicali', 'Rosarito', 'San Felipe', 'San Quintín', 'Tecate', 'Tijuana'],
            validator: { required: true } 
          },
          { 
            key: 'num_empleados', 
            label: '6. Número de empleados directos', 
            placeholder: 'Número de empleados directos',
            type: 'number', 
            validator: { required: true, min: 0 } },
          { 
            key: 'ano_inicio_operaciones', 
            label: '7. Año en que inició operaciones', 
            placeholder: "Año en que inició operaciones",
            type: 'number', 
            validator: { required: true } },
          {
            key: 'giro_principal',
            label: '8. Giro principal de la empresa',     
            placeholder: 'Giro principal de la empresa',       
            options: [
              'Actividades bursátiles, cambiarias y de inversión financiera',
              'Agricultura',
              'Aprovechamiento forestal',
              'Autotransporte de carga',
              'Comercio al por mayor de abarrotes, alimentos, bebidas, hielo y tabaco',
              'Comercio al por mayor de maquinaria, equipo y mobiliario para actividades agropecuarias, industriales, de servicios y comerciales, y de otra maquinaria y equipo de uso general',
              'Comercio al por mayor de materias primas agropecuarias y forestales, para la industria, y materiales de desecho',
              'Comercio al por mayor de productos farmacéuticos, de perfumería, artículos para el esparcimiento, electrodomésticos menores y aparatos de línea blanca',
              'Comercio al por mayor de productos textiles y calzado', 
              'Comercio al por menor de artículos de ferretería, tlapalería y vidrios',
              'Comercio al por menor de artículos de papelería, para el esparcimiento y otros artículos de uso personal',
              'Comercio al por menor de artículos para el cuidado de la salud',
              'Comercio al por menor de enseres domésticos, computadoras, artículos para la decoración de interiores y artículos usados',
              'Comercio al por menor de productos textiles, bisutería, accesorios de vestir y calzado',
              'Comercio al por menor de vehículos de motor, refacciones, combustibles y lubricantes',
              'Comercio al por menor en tiendas de autoservicio y departamentales',
              'Compañías de seguros, fianzas, y administración de fondos para el retiro',
              'Construcción de obras de ingeniería civil',
              'Cría y explotación de animales',
              'Curtido y acabado de cuero y piel, y fabricación de productos de cuero, piel y materiales sucedáneos',
              'Edificación',
              'Fabricación de equipo de transporte',
              'Fabricación de insumos textiles y acabado de textiles',
              'Fabricación de maquinaria y equipo',
              'Fabricación de muebles, colchones y persianas',
              'Fabricación de prendas de vestir',
              'Fabricación de productos a base de minerales no metálicos',
              'Fabricación de productos derivados del petróleo y del carbón',
              'Fabricación de productos metálicos',
              'Fabricación de productos textiles, excepto prendas de vestir',
              'Generación, transmisión, distribución y comercialización de energía eléctrica, suministro de agua y de gas natural por ductos al consumidor final',
              'Impresión e industrias conexas',
              'Industria alimentaria',
              'Industria de la madera',
              'Industria de las bebidas y del tabaco',
              'Industria del papel',
              'Industria fílmica y del video, e industria del sonido',
              'Industria química',
              'Industrias metálicas básicas',
              'Instituciones de intermediación crediticia y financiera no bursátil',
              'Manejo de residuos y servicios de remediación',
              'Minería de minerales metálicos y no metálicos, excepto petróleo y gas',
              'Museos, sitios históricos, zoológicos y similares',
              'Otras industrias manufactureras',
              'Otros servicios de asistencia social',
              'Pesca, caza y captura',
              'Residencias de asistencia social y para el cuidado de la salud',
              'Servicios artísticos, culturales y deportivos, y otros servicios relacionados',
              'Servicios de almacenamiento',
              'Servicios de alojamiento temporal',
              'Servicios de alquiler de bienes muebles',
              'Servicios de apoyo a los negocios',
              'Servicios de entretenimiento en instalaciones recreativas y otros servicios recreativos',
              'Servicios de mensajería y paquetería',
              'Servicios de preparación de alimentos y bebidas',
              'Servicios de reparación y mantenimiento',
              'Servicios educativos',
              'Servicios inmobiliarios',
              'Servicios médicos de consulta externa y servicios relacionados',
              'Servicios personales',
              'Servicios profesionales, científicos y técnicos',
              'Ninguna de las anteriores'
            ],
            validator: { required: true }
          },
          {
            key: 'otro_giro',
            label: '9. Otro giro de la empresa',            
            placeholder: "Otro giro de la empresa",
            type: 'text',
            validator: { required: false }
          },
          {
            key: 'es_miembro_asociacion',
            label: '10. ¿Es miembro de una asociación, cámara u organización?',  
            placeholder: "Asociación, cámara y organización",          
            options: ['si', 'no'],
            validator: { required: true }
          },
          {
            key: 'asociacion',
            label: '10.1. Cámara, asociación u organización',            
            placeholder: '',
            options: [
                'Asociación de Agentes Aduanales de Mexicali, A.C. (AAAM)',
                'Asociación de Maquiladoras de Mexicali, A.C. (INDEX)',
                'Asociación Mexicana de Hoteles y Moteles de Mexicali, A.C.',
                'Asociación Mexicana de Profesionales Inmobiliarios. (AMPI)',
                'Asociación De Profesionales Inmobiliarios de Mexicali, A.C. (API)',
                'Cámara Nacional de la Industria de Desarrollo y Promoción de Vivienda, Mexicali. (CANADEVI)',
                'Cámara Mexicana de la Industria de la Construcción, Delegación Mexicali. (CMIC)',
                'Cámara Nacional de Comercio, Servicios y Turismo de Mexicali. (CANACO)',
                'Cámara Nacional de la Industria de Transformación, Delegación Mexicali. (CANACINTRA)',
                'Cámara Nacional de la Industria de Restaurantes y Alimentos Condimentados, Delegación Mexicali. (CANIRAC)',
                'Cámara Nacional del Autotransporte de Carga, Delegación Mexicali. (CANACAR)',
                'Centro Empresarial de Mexicali. (COPARMEX)',
                'Colegio de Contadores Públicos de Mexicali. (CCPM)',
                'Comisión de Desarrollo Industrial de Mexicali. (CDIM)',
                'Comité de Turismo y Convenciones. (COTUCO)',
                'Comité de Vinculación de Mexicali, A.C.',
                'Consejo Agropecuario de Baja California, A.C. (CABC)',
                'Consejo Coordinador Empresarial de Mexicali. (CCE)',
                'Consejo de Desarrollo Económico de Mexicali, A.C. (CDEM)',
                'Unión Agrícola Regional de Productores de Hortalizas del Valle de Mexicali. (UARPH)',
                'Unión de Concesionarios de Automóviles Nuevos, A.C. (UCAN)',
                'Ejecutivos en Relaciones Industriales en Baja California. (ERIBAC)',
                'Asociación de Agentes Aduanales en Tijuana-Tecate, A.C. (AAAT)',
                'Asociación de Agentes Inmobiliarios de Baja California. (ASAI)',
                'Asociación de Comerciantes del Centro Histórico de Tijuana.',
                'Asociación de Comerciantes Turísticos de Tijuana A.C.',
                'Asociación de Industriales de la Mesa De Otay, A.C. (AIMO)',
                'Asociación de La Industria Maquiladora y de Exportación de Zona Costa B.C. (Index)',
                'Asociación Mexicana de Profesionales Inmobiliarios de Tijuana (AMPI)',
                'Asociación Mexicana de Hoteles y Moteles De Tijuana, A.C.',
                'Asociación de Profesionales Inmobiliarios de Tijuana, A.C. (API)',
                'Cámara Nacional de La Industria Electrónica de Telecomunicaciones y Tecnologías de Información. Sede Noroeste (CANIETI)',
                'Cámara Nacional de Comercio, Servicios Y Turismo De Tijuana (CANACO)',
                'Cámara Nacional de Comercio en Pequeño, S.C. (CANACOPE)',
                'Cámara Nacional de la Industria de Transformación (CANACINTRA)',
                'Cámara Nacional de la Industria de Restaurantes y Alimentos Condimentados (CANIRAC)',
                'Cámara Mexicana de la Industria de la Construcción, Deleg. Tijuana (CMIC)',           
                'Cámara Nacional de la Industria de Desarrollo y Promoción de Vivienda. (CANADEVI)',
                'Cámara Nacional de Autotransporte de Carga, Deleg. Tijuana (CANACAR)',
                'Centro Empresarial de Tijuana (COPARMEX)',    
                'Comité de Turismo y  Convenciones de Tijuana (COTUCO)',
                'Comité de Vinculación Educativa Tijuana', 
                'Consejo de Desarrollo Económico de Tijuana, A.C. (CDT)',        
                'Consejo Coordinador Empresarial Tijuana, A.C. (CCE)',
                'Consejo Estatal Profesionales Inmobiliario de Baja California (CEPIBC)',
                'Desarrollo Económico e Industrial de Tijuana A C. (DEITAC)',  
                'Colegio de Contadores Públicos de Baja California (CCPBC)',
                'Asociación de Agentes Aduanales de Ensenada, A.C.(AAAE)',
                'Asociación Compañías Mexicanas de la Industria de la Construcción (COMICE)',
                'Asociación Mexicana de Hoteles y Moteles de Ensenada, A.C',
                'Asociación Mexicana de Profesionales Inmobiliarios de Ensenada (AMPI)',
                'Asociación de Profesionales Inmobiliarios de Ensenada, A.C. (API)',  
                'Cámara Nacional de Comercio y Servicios Turísticos (CANACO)',
                'Cámara Nacional de la Industria de la Transformación, Delegación. Ensenada. (CANACINTRA)',
                'Cámara Nacional de la Industria Pesquera Acuícola (CANAINPESCA)',
                'Centro Empresarial de Ensenada (COPARMEX)',
                'Comisión de Promoción Económica de Ensenada A.C.',                     
                'Proturismo De Ensenada',
                'Comité de Vinculación Escuela – Empresa (COVEE)',
                'Consejo Consultivo Económico de Ensenada A.C.',
                'Consejo Coordinador Empresarial de Ensenada (CCE)',
                'Consejo de Desarrollo Económico de Ensenada, A.C. (CODEEN)',
                'Unión Agrícola Regional de Productores de Legumbres de la Costa del Estado de B.C. (UAREDA)',
                'Consejo Agrícola Zona Costa (CABC)',
                'Asociación de Profesionales Inmobiliarios de Tecate, A.C. (API)',
                'Cámara Nacional de Comercio Servicios y Turismo de Tecate (CANACO)',
                'Cámara Nacional de la Industria  de la Transformación De Tecate (CANACINTRA)',
                'Comisión de Promoción Económica de Tecate, A.C.',
                'Consejo de Desarrollo Económico de Tecate, A.C. (CDET)',
                'Consejo Coordinador Empresarial de Tecate, (CCE)',
                'Comité de Vinculación Educativa Tecate, A.C',
                'Asociación de Fabricantes de Muebles y Accesorios de Rosarito, A.C.',
                'Asociación Mexicana de Hoteles y Moteles de Rosarito, A.C',               
                'Asociación Mexicana de Profesionales Inmobiliarios de Rosarito (AMPI)',
                'Asociación de Profesionales Inmobiliarios de Rosarito, A.C. (API)',
                'Consejo Consultivo de Desarrollo Económico de Rosarito, A.C. (CCDER)',
                'Consejo Coordinador Empresarial de Playas de Rosarito (CCE)',
                'Cámara Nacional de la Industria de Restaurantes y Alimentos Condimentados (CANIRAC)',
                'Asociación Mexicana de Profesionales Inmobiliarios de San Felipe, A.C. (AMPI)',
                'Ninguna de las anteriores'
            ],
            validator: { required: false }
          },
          {
            key: 'otra_asociacion',
            label: '10.2 Si tu Cámara, Asociación u Organización no apareció en la lista, por favor escríbela aquí',
            placeholder: 'Cámara, Asociación u Organización',
            type: 'text',
            validator: { required: false }
          }
        ]
      }
    ],
    [
      {
        title: "Sección B: Cuéntanos qué limita el crecimiento de tu empresa",
        fields: [
          { key: 
            'relacionado_gobierno', 
            label: '11. Lo que limita el crecimiento de tu empresa ¿está relacionado con el gobierno?', 
            options: ['si', 'no'], 
            validator: { required: true } },
          { 
            key: 'nivel_gobierno', 
            label: '12. ¿Sabes con cuál nivel de gobierno está relacionada tu limitante?',             
            options: ['Federal', 'Estatal', 'Municipal', 'No sé'],
            validator: { required: true } 
          },
          { 
            key: 'relacionado_sitio_web', 
            label: '13. La limitante, ¿Tiene que ver con el sitio web o aplicación del gobierno?', 
            options: ['si', 'no'], validator: { required: true } },
          {
            key: 'limitantes_sitio_web',
            label: '13.1. ¿Qué limitantes has encontrado al usar el sitio web o aplicación del gobierno?',            
            options: [
              'Poco intuitiva',
              'No se entiende',
              'No funciona',
              'No carga los archivos',
              'Sin respuesta/marca error',
              'Información incompleta',
              'Información no actualizada',
              'Lenta',
              'Ninguna de las anteriores'
            ],
            validator: { required: true }
          },
          { 
            key: 'otra_limitante_sitio_web', 
            label: '13.2. Si seleccionaste "ninguna de las anteriores", por favor escribe la que corresponda.', 
            type: 'text', 
            validator: { required: false } },
          { 
            key: 'relacionado_leyes', 
            label: '14. La limitante, ¿Tiene que ver con leyes o regulaciones?',             
            options: ['si', 'no'],
            validator: { required: true } },
          {
            key: 'leyes_regulaciones',
            label: '14.1. Las leyes o regulaciones son:',            
            options: ['Excesivas', 'Confusas', 'Repetitivas/Duplicadas'],
            validator: { required: true }
          },
          { 
            key: 'relacionado_tramites', 
            label: '15. La limitante a la que te enfrentas, ¿Se debe a cómo se realizan los trámites?',             
            options: ['si', 'no'],
            validator: { required: true } },
          {
            key: 'tramites',
            label: '15. La realización de los trámites es:',            
            options: ['Lenta (tardan más de lo establecido)', 'Sin seguimiento (nadie sabe dónde está el trámite)', 'No dan respuesta (ni resuelven que si, ni resuelven que no)'],
            validator: { required: true }
          },
          { 
            key: 'relacionado_mercado', 
            label: '16. Lo que te impide crecer, ¿Está relacionado con el mercado en el que opera tu empresa?', 
            options: ['si', 'no'],
            validator: { required: true } },
          {
            key: 'limitantes_mercado',
            label: '16.1. ¿Qué limitantes del mercado estás enfrentando?',            
            options: [
              'Falta de Financiamiento',
              'Falta de Capacitación',
              'Agente Económico Dominante',
              'Falta de Regulación',
              'Competencia Desleal',
              'Falta de Talento',
              'Otro'
            ],
            validator: { required: true }
          },
          { 
            key: 'otra_limitante_mercado', 
            label: '16.1.1. ¿A qué otra limitante te estás enfrentando?',
            placeholder: 'Ingresa otra limitante',
            type: 'text', 
            validator: { required: false } }
        ]
      }
    ],
    [
      {
        title: "Sección C: Cuéntanos: ¿Cuál es la limitante recurrente de tu empresa?",
        fields: [
          { 
            key: 'descripcion_limitante', 
            label: '17. Explica con claridad las situaciones que constantemente han limitado el crecimiento de tu empresa.', 
            type: 'text', 
            validator: { required: true } },
          { 
            key: 'archivo_limitante', 
            label: '17.1 ¿Deseas agregar algún archivo sobre lo que escribiste? (PDF)', 
            type: 'text', 
            validator: { required: false } },
          { 
            key: 'propuesta_solucion', 
            label: '18. Qué propones para solucionar esas limitantes?', 
            type: 'text', 
            validator: { required: false } },
          { 
            key: 'archivo_propuesta', 
            label: '18.1 ¿Deseas agregar algún archivo de tu propuesta? (PDF)', 
            type: 'text', 
            validator: { required: false } }
        ]
      }
    ]
  ]
}
/* {  
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
    form = JSON.parse(JSON.stringify(FORM_DEFINITION));
    conditionals: FormConditional[] = [
      // Conditionals for Section A
      { key: 'giro_principal', operator: '!==', value: 'Ninguna de las anteriores', target: 'otro_giro', targetAction: 'disabled' },
      { key: 'es_miembro_asociacion', operator: '!==', value: 'si', target: 'asociacion', targetAction: 'disabled' },
      { key: 'asociacion', operator: '!==', value: 'Ninguna de las anteriores', target: 'otra_asociacion', targetAction: 'disabled' },

      // Conditionals for Section B
      { key: 'relacionado_gobierno', operator: '!==', value: 'si', target: 'nivel_gobierno', targetAction: 'disabled' },
      { key: 'relacionado_sitio_web', operator: '!==', value: 'si', target: 'limitantes_sitio_web', targetAction: 'disabled' },
      { key: 'limitantes_sitio_web', operator: '!==', value: 'Ninguna de las anteriores', target: 'otra_limitante_sitio_web', targetAction: 'disabled' },
      { key: 'relacionado_leyes', operator: '!==', value: 'si', target: 'leyes_regulaciones', targetAction: 'disabled' },
      { key: 'relacionado_tramites', operator: '!==', value: 'si', target: 'tramites', targetAction: 'disabled' },
      { key: 'relacionado_mercado', operator: '!==', value: 'si', target: 'limitantes_mercado', targetAction: 'disabled' },
      { key: 'limitantes_mercado', operator: '!==', value: 'Otro', target: 'otra_limitante_mercado', targetAction: 'disabled' },
    ];
    currentSection = 0;
    isSectionValid = false;

    nextSection() {
        if (this.isSectionValid) {
            if (this.currentSection < this.form.forms.length - 1) {
                this.currentSection++;
                this.isSectionValid = false; // Reset for the new section
            } else {
                this.submitForm();
            }
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.isSectionValid = false; 
        }
    }

    submitForm() {
        // Logic to submit the whole form will be implemented here
    }
}
