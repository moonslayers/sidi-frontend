---
name: Testing and revision
about: Solicitud de revisión y pruebas
title: "[TEST]"
labels: test
assignees: ana-robles25

---

<!---
¡Gracias por ayudarnos a mejorar! Tu colaboración es clave para garantizar la calidad del producto. Por favor, sigue esta plantilla para que podamos entender claramente qué probar y cómo hacerlo.
-->

## 🎯 ¿Tu solicitud está relacionada con un problema? Por favor describe.

Describe brevemente el problema que estás reportando o que necesitas que se revise. Incluye el comportamiento esperado vs. el comportamiento actual. Si está relacionado con otros issues, enlázalos aquí.  
**Ejemplo:**  
> Al guardar un convenio, el formulario se bloquea y no responde. Aunque los datos se envían (según logs), el usuario no recibe confirmación y debe recargar la página. Esto ocurre en Chrome y Edge, pero no en Firefox.

---

## 💡 ¿Qué funcionalidad o comportamiento se debe probar?

Describe con claridad:
- Qué se debe probar (flujo, componente, API, etc.)
- Cómo debería funcionar en condiciones normales
- Casos de uso clave

**Ejemplo:**  
> Se debe probar el flujo completo de creación de un convenio: selección de acreditados → carga de datos → validación → envío → confirmación.  
> El sistema debe mostrar un mensaje de éxito al guardar, sin bloquear la interfaz, y permitir al usuario seguir navegando.

---

## 🔍 Pasos para reproducir (si aplica)

Sigue este formato si estás reportando un bug o necesitas que se valide un escenario específico:

1. Inicia sesión como administrador
2. Ve a `/convenios/nuevo`
3. Selecciona 3 acreditados
4. Completa todos los campos obligatorios
5. Haz clic en "Guardar"
6. Observa el comportamiento del botón y la interfaz

**Resultado esperado:**  
El botón muestra "Guardando..." y luego "Guardado", sin bloquearse. Se redirige o actualiza el estado.

**Resultado actual:**  
El botón queda en estado "Guardando..." indefinidamente. La interfaz no responde.

---

## 🌐 Sección o secciones afectadas

Indica las URLs, rutas, componentes o pantallas involucradas.  
Agrega capturas de pantalla si es posible (o enlace a ellas) con anotaciones si es necesario.

- **URL:** `https://app.midominio.com/convenios/nuevo`
- **Componente:** `FormConvenio.jsx`
- **Estado del flujo:** Paso 2 de 3 (Carga de acreditados)
- **Captura:** [📎 imagen-ejemplo.png](link-a-captura)  
  *Descripción:* Pantalla donde se seleccionan acreditados y se bloquea al guardar.

---

## 🧪 Escenarios de prueba recomendados

Ayuda al tester a enfocarse en casos críticos. Incluye:

- ✅ **Escenario normal:** Flujo completo con datos válidos
- ⚠️ **Escenario de borde:** Muchos acreditados (>100), campos vacíos, archivos grandes
- ❌ **Escenario de error:** Sin conexión, token expirado, permisos insuficientes
- 🔄 **Reintentos y estados de carga:** ¿Se puede reintentar? ¿Hay feedback visual?

---

## 🔄 Alternativas consideradas o workarounds

¿Hay alguna forma temporal de evitar el problema o validar el comportamiento?  
**Ejemplo:**  
> Recargar la página después del envío permite ver que el convenio sí se guardó, pero el usuario pierde contexto.

---

## 🧑‍💼 ¿Fue reportado o solicitado por un usuario final?

- [ ] Sí
- [ ] No  
- **Nombre o ID del usuario (si aplica):** [ej. María López, cliente@empresa.com, ID: USR-789]

---

## 📎 Contexto adicional

Incluye cualquier información útil:
- Logs de error (fragmentos relevantes)
- Navegadores o dispositivos afectados
- Entornos donde ocurre (producción, staging, local)
- Fecha/hora aproximada del primer reporte
- Enlaces a PRs, commits o documentación relacionada

> **Ejemplo:**  
> El error comenzó a aparecer después del despliegue v2.4.1.  
> Error en consola: `TypeError: Cannot read property 'map' of undefined`  
> Afecta a usuarios con rol "Editor" y "Admin".

---

## ✅ Checklist para el tester

Antes de entregar el reporte, verifica:
- [ ] El problema se reproduce en más de un navegador
- [ ] Se probaron casos de datos válidos e inválidos
- [ ] Se revisó el comportamiento en móvil (si aplica)
- [ ] Se adjuntaron pantallazos o videos del flujo
- [ ] Se incluyeron mensajes de error (consola, red, etc.)

📌 **Nota:** Cuanto más detallado sea el reporte, más rápido podremos resolverlo. ¡Gracias por tu tiempo y atención al detalle!
