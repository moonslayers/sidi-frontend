# 🚀 Proyecto Angular 20 (Standalone)

## Tecnologías

- **Angular 20**  
- **Bootstrap 5** + **Bootstrap Icons**  
- **Componentes Standalone**  
- Sintaxis moderna: `@if`, `@for`, `@else`

## Instalación

```bash
npm install
ng serve
```

## Estructura

- Todos los componentes son **standalone** (sin módulos).
- Estilos: importados desde Bootstrap 5 (CDN o node_modules).
- Iconos: usados directamente con `<i class="bi bi-icon-name"></i>`.

Siempre revisa los modelos en models/
Cada modelo tiene un controlador en controllers/ del mismo nombre pero termina en .service.ts
para jalar datos del servidor todos los controladores heredan de SuperService y en cada llamada puedes incluir lista de relaciones o conditionals segun estan documentados en SuperService
siempre haz un plan y presentalo antes de empezar a trabajar
no hagas commits de manera automatica a menos que explicitamente se te pida
al hacer commits no menciones coautoria por claude
siempre al final asegurate que compile con ng b antes de terminar y arregla los errores
tambien antes de terminar verifica que cumpla con el eslint
NO SOBREESCRIBAS COLORES DE CLASES DE BOOTSTRAP trata siempre de usar solo clases de bootstrap siempre que se pueda

Metodos Real del SuperService (Comprendida)

Métodos Principales:

- new(data) → T | undefined
- update(id, data) → StandarResponse\<T>
- find(id) → T | undefined
- all() → T[]
- switch(id) → boolean (elimina/restaura)
- get() → StandarResponse\<T[]>
