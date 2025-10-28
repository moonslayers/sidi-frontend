# Guía de Versiones para Colaboradores

## 📋 Introducción

Esta guía establece el proceso obligatorio para modificar versiones en el proyecto. **Todo PR debe incluir un cambio de versión** según el tipo de cambios realizados.

## 🚀 Comandos Disponibles

```bash
# Para correcciones y ajustes menores
npm run version:patch

# Para nuevas funcionalidades y componentes
npm run version:minor  

# Para secciones/modulos completamente nuevos
npm run version:major
```

## 📊 Criterios de Versionamiento

### 🔧 `version:patch` (Mantenimiento)

**Usar cuando:**

- Arreglar bugs o errores
- Hotfixes urgentes
- Ajustes menores en componentes existentes
- Mejoras de performance menores
- Correcciones de estilo/documentación

**Ejemplos:**

- ✅ Arreglé un bug en el componente de login
- ✅ Corregí un error de typo en los estilos CSS
- ✅ Ajusté la validación del formulario de contacto
- ✅ Optimicé una consulta a la base de datos

### 🎯 `version:minor` (Nuevas Funcionalidades)  

**Usar cuando:**

- Agregar nuevos componentes
- Implementar nuevas features
- Mejoras significativas a funcionalidades existentes
- Nuevos endpoints API
- Integraciones con servicios externos

**Ejemplos:**

- ✅ Agregué un componente de dashboard para estadísticas
- ✅ Implementé integración con API de PayPal
- ✅ Creé un nuevo formulario de registro
- ✅ Agregué sección para generar reportes de buró
- ✅ Añadí sistema de notificaciones push

### 🏗️ `version:major` (Cambios Estructurales)

**Usar cuando:**

- Agregar módulos/secciones completamente nuevas
- Cambios que rompen compatibilidad con versiones anteriores
- Refactorizaciones masivas de arquitectura
- Nuevas líneas de negocio o productos

#### Requiere aprobación del líder de proyecto

**Ejemplos:**

- ✅ Implementamos módulo para apoyos de gobierno (nueva línea de negocio)
- ✅ Agregamos sección completa de analítica empresarial
- ✅ Refactorizamos toda la arquitectura de microservicios
- ✅ Cambiamos el framework principal del frontend

## 📝 Proceso Obligatorio para PRs

1. **Sincronizar con main** siempre antes de trabajar

   ```bash
   git pull origin main
   ```

2. **Ejecutar el comando correspondiente** según el tipo de cambios

   ```bash
   npm run version:patch  # o minor/major según corresponda
   ```

3. **El cambio de versión debe incluirse en el PR** - Sin esto, el PR será rechazado

4. **Describir claramente** en el PR qué tipo de cambios justifican la versión seleccionada

## ❌ Casos de Rechazo

- PR sin cambio de versión
- Versión incorrecta para los cambios realizados  
- Conflictos con la rama main por falta de sincronización
- No justificar la selección de versión en la descripción del PR

## 🔍 Ejemplos Prácticos

### Caso 1: Corrección de Bug

```bash
# Cambios: Arreglé un bug en el cálculo de intereses
# Comando: 
npm run version:patch
```

### Caso 2: Nueva Feature  

```bash
# Cambios: Agregué componente de gráficas para reportes
# Comando:
npm run version:minor
```

### Caso 3: Módulo Nuevo

```bash
# Cambios: Implementé módulo completo de apoyos gubernamentales
# Comando: 
npm run version:major
# Nota: Requiere aprobación del líder
```

## 📞 Dudas y Consultas

Si tienes dudas sobre qué versión usar, consulta con:

- El líder de proyecto
- Los maintainers del repositorio
- Revisa PRs anteriores como referencia

**Recuerda:** La consistencia en el versionamiento ayuda a mantener un historial claro y comprensible del proyecto.
