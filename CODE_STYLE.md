# 🧭 Guía Frontend - Convenciones y Estándares

> Stack: Angular + Bootstrap 5  
> Librerías principales: Chart.js, animate.css, pdfmake  
> Principio general: Reutilizar, documentar, estandarizar.

---

## 🎨 Estilos y UI

- **Bootstrap 5 es la base de diseño**, evita duplicados.
- Si se necesita un estilo personalizado:
  - Solo si **no es posible con Bootstrap**.
  - Colocar en los `.scss` locales del componente.
- **Animate.css** para animaciones visuales:
  - Usar clases predefinidas primero.
  - Crear animaciones personalizadas solo si es necesario y previa consulta.

---

## 📊 Gráficas (Chart.js)

- Existe un **componente reutilizable `GraphsViewComponente`** para gráficas comunes.
- Usar ese componente siempre que sea posible para mostrar gráficas.
- Usar directamente Chart.js **solo si se requiere algo especializado y explícitamente solicitado**.

---

## 📄 Documentación del código

- Todo código debe estar bien **documentado con TSDocs**.
- Seguir principios de **código limpio**:
  - Funciones pequeñas y responsabilidad única.
  - Nombres claros y descriptivos.
  - Comentarios explicativos donde sea necesario.

---

## 🗂️ Estructura de carpetas y modelos

### Modelos (`models/`)

- Todos los modelos de tablas van aquí.
- Deben heredar de `BaseModel`.
- Nombre: `nombre.entidad.model.ts` → si es largo, omitir `.model`.

### Controladores (`controllers/`)

- Solo modelos de tabla tienen controlador en esta carpeta.
- El nombre del controlador es: `nombre.entidad.service.ts`.
- Todos heredan de `SuperService`.

### Modelos auxiliares

- Si el modelo se usa **solo en un componente**, va dentro del archivo `.ts` del componente.
- Si se usa en varios componentes, crear un archivo independiente con `export interface`.

### Rutas

- Cada seccion tiene un archivo de rutas **nombreSeccion.routes.ts**, va dentro de la carpeta raiz de la sección.
- Las rutas de importan de manera laiz en el archivo de rutas principal segun sea el caso.

---

## 🔄 Servicios y APIs

- **Toda llamada a API va en un servicio**.
- Usar `ApiService` (maneja observables y errores).
- No manejar observables directamente salvo casos específicos (ej: ToastService, DialogService, FormService) que son para funcionalidad mas que para jalar datos.

---

## 🔁 Componentes reutilizables

- Los reutilizables a nivel app van en `shared/`.
- Si son reutilizables a nivel de sección (ej: `EstadoCuenta`), irán en `shared/` dentro de esa carpeta.
- Lo mismo aplica a:
  - **Pipes**
  - **Servicios específicos de sección**
  - **etc.**

---

## ⚙️ Signals y Observables

- Originalmente no se usaban `signals`, pero ahora están siendo adoptados gradualmente por la nueva version de angular.
- Usarlos **con criterio** y siguiendo buenas prácticas de código limpio.
- Para funcionalidades reactivas si se usan observables (Toast, Dialogs, Forms) se usan son algunos ejemplos para que el criterio que si aplica:
  - `ToastService`
  - `VanillaDialogService`
  - `GenericFormService`

---

## ✍️ Formularios

- Usar siempre que sea posible `GenericForm`.
- Si no cumple con el requerimiento, evaluar primero mejorar `GenericForm` antes de crear uno nuevo y consultar con el equipo.

---

## 📋 Tablas

- Usar siempre que sea posible `TablaComponent`.
- Si no cubre el caso, revisar posibilidad de mejora antes de crear una tabla nueva.

---

## 💬 Diálogos y Notificaciones

- Para diálogos: usar `VanillaDialogService`.
- Para notificaciones tipo toast: usar `ToastService`.
- Usar componentes de `shared` para mantener consistencia visual y comportamiento.

## :window: Ventanas y componentes flotantes

- Para ventanas flotantes: usar `FormularioFloante`.
- Usar siempre que sea posible este componente, revisar posibilidad de mejora antes de hacer un componente especifico para el caso y consultar con el equipo.

---

## 📁 Ejemplo de estructura de archivos

```bash
src/
 └── app/
      ├── models/
      │    ├── usuario.model.ts
      │    └── factura.model.ts
      ├── controllers/
      │    ├── usuario.service.ts
      │    └── factura.service.ts
      ├── shared/
      │    ├── components/
      │    │     ├── grafica.component.ts
      │    │     └── tabla.component.ts
      │    ├── services/
      │    │     ├── api.service.ts
      │    │     └── toast.service.ts
      │    └── pipes/
      │          └── filtro.pipe.ts
      ├── estado-cuenta/
      │    ├── shared/
      │    │     ├── components/
      │    │     └── services/
      │    ├── pages/
      │    └── estado-cuenta.module.ts
      └── ...
```

---

## 📝 Pull Requests

- **Revisar siempre los comentarios y cambios sugeridos**, incluso si son de documentación.
- PR’s deben tener cambios enfocados y coherentes.
- Eliminar ramas después del merge.
- Usa la [guía rápida de branches](./BRANCHES_GUIDE.md).
