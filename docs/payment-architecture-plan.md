# Plan de Arquitectura para Pagos en Línea

Este documento define una ruta práctica para evaluar pagos en línea en Terrazzo. Es un plan de arquitectura para fases futuras: no cambia el checkout actual, no agrega botones de pago y no implementa integraciones de pago.

## 1. Estado actual del MVP

El sitio actual de Terrazzo es un MVP estático publicado en GitHub Pages. No tiene backend propio ni servidor de aplicación; los archivos HTML, CSS, JavaScript, imágenes y JSON se sirven directamente desde el repositorio.

El carrito existe en el frontend y guarda su estado en `localStorage`. La persona agrega productos, revisa su pedido y el checkout genera un mensaje de WhatsApp con:

- Código de pedido.
- Pedido itemizado.
- Total estimado.
- Texto para transferencia.
- Nota de confirmación final.

El pago se maneja manualmente: el cliente conversa por WhatsApp, Terrazzo confirma total, disponibilidad y datos de transferencia, y el staff valida el pago antes de preparar o entregar el pedido.

Este flujo es suficiente para el MVP/demo porque permite validar interés, menú, precios, experiencia de pedido y operación real sin asumir todavía el costo técnico de pagos en línea.

## 2. Por qué los pagos en línea necesitan planeación

Una integración con proveedor de pagos debe proteger credenciales, tokens privados y datos sensibles. Un sitio estático en GitHub Pages no debe exponer access tokens secretos, llaves privadas ni credenciales de Mercado Pago dentro del JavaScript, HTML, JSON o repositorio.

La confirmación real de pago requiere una parte confiable fuera del navegador: normalmente un backend, una función serverless o un enfoque aprobado por el proveedor. El frontend puede iniciar una experiencia de pago, pero no debe ser la fuente final de verdad para precios, disponibilidad o estado del pago.

También deben considerarse webhooks o notificaciones del proveedor. Sin webhooks, el sitio podría depender solo del regreso del usuario al navegador, lo cual no siempre es confiable. Las notificaciones permiten confirmar pagos aprobados, rechazados, pendientes o cancelados aun si el usuario cierra la página.

## 3. Opciones de pago a evaluar

### Opción A - Mantener WhatsApp + transferencia

- Menor complejidad técnica.
- No requiere SDKs, backend, servidor ni credenciales de pago.
- No agrega trabajo de integración ni comisiones técnicas adicionales.
- La confirmación sigue siendo manual por parte del staff.
- Es la mejor opción para el MVP y para validación con el owner.

Esta opción mantiene el flujo actual: el pedido llega por WhatsApp y Terrazzo confirma pago, disponibilidad y preparación por chat.

### Opción B - Link de pago de Mercado Pago / flujo manual de link

- Baja complejidad técnica.
- El staff puede generar y compartir links de pago manualmente.
- Permite cobrar en línea sin integrar todavía el carrito con un backend.
- Sigue siendo menos automatizado: el link podría no estar conectado al detalle exacto del carrito.
- Es un paso intermedio si el owner quiere pago en línea pronto, pero sin construir todavía una arquitectura completa.

Esta opción puede funcionar como prueba operativa: Terrazzo recibe el pedido por WhatsApp, confirma total y disponibilidad, y después comparte un link de pago.

### Opción C - Mercado Pago Checkout Pro con backend/serverless para crear preferencias

- El cliente revisa su carrito y hace clic en pagar.
- El backend o endpoint serverless recibe el pedido y valida productos/precios contra una fuente confiable.
- El backend crea una preferencia de pago en Mercado Pago usando credenciales protegidas.
- El frontend redirige al cliente al checkout de Mercado Pago mediante el `init_point` o link aprobado.
- Mercado Pago envía notificaciones/webhooks para confirmar el estado del pago.
- Requiere credenciales, ambiente de despliegue, pruebas sandbox, configuración productiva y monitoreo básico.

Esta es una candidata fuerte para un sistema de producción futuro porque separa responsabilidades: el frontend muestra el carrito, el backend protege credenciales y Mercado Pago procesa el cobro.

### Opción D - Admin completo + pagos más adelante

- Combina pagos con administración de pedidos, productos, estados y posiblemente usuarios.
- Tiene mayor costo, alcance y complejidad.
- Puede ser valioso si el owner se compromete a un sistema pagado completo.
- No conviene mezclarlo con la primera integración de pagos si todavía no está validada la necesidad.

Esta opción debe tratarse como una fase posterior. Un Admin puede ser muy útil, pero construir pagos y administración completa al mismo tiempo aumenta el riesgo de retrasos y deuda operativa.

## 4. Ruta recomendada para Terrazzo

Para demos y validación del MVP, Terrazzo debería mantener el flujo actual de WhatsApp + transferencia. Es claro, barato, entendible para el staff y suficiente para observar si los clientes realmente usan el carrito.

Durante la demo con el owner, conviene validar si el pago en línea resolvería un problema real:

- Menos fricción para clientes.
- Menos trabajo manual para staff.
- Mejor confirmación de pedidos.
- Mayor conversión.
- Mejor control de pedidos pagados.

Si el owner aprueba avanzar, la siguiente ruta recomendada es construir una prueba pequeña con Mercado Pago Checkout Pro usando un backend serverless. Esa prueba debe enfocarse solo en crear preferencias de pago, redireccionar correctamente y recibir estados básicos de pago.

No se recomienda implementar Admin completo y pagos en la misma fase o PR. Primero conviene probar el cobro en línea con alcance reducido; después, si aporta valor, planear administración de pedidos.

## 5. Arquitectura técnica futura propuesta

La arquitectura futura puede mantener el frontend estático o evolucionarlo a una app más completa. El punto importante es que la creación y confirmación de pagos ocurra en una capa confiable, no solo en el navegador.

Flujo propuesto:

1. El cliente arma el carrito en el frontend.
2. El frontend envía datos del pedido a un endpoint backend/serverless.
3. El backend valida IDs, cantidades, precios y disponibilidad contra una fuente de menú confiable.
4. El backend calcula el total final.
5. El backend genera o confirma un código de pedido.
6. El backend crea una preferencia de pago con Mercado Pago.
7. El backend devuelve al frontend el código de pedido y el link/init point de pago.
8. El frontend redirige al cliente al checkout de Mercado Pago.
9. Mercado Pago envía actualizaciones a un endpoint webhook.
10. El backend registra el estado del pago.
11. En una fase posterior, staff/admin consulta pedidos y estados: pendiente, pagado, rechazado, cancelado, preparado o entregado.

Componentes probables:

- Frontend: sitio estático actual o futura app.
- Endpoint `create-payment-preference`: crea la preferencia con credenciales protegidas.
- Fuente confiable de menú/precios: JSON validado, base de datos o configuración administrable.
- Endpoint `payment-webhook`: recibe notificaciones de Mercado Pago.
- Almacenamiento de pedidos: base de datos, tabla serverless o servicio equivalente.
- Vista staff/admin futura: seguimiento de pedidos y estados.

## 6. Notas de seguridad y datos

- Nunca commitear credenciales de Mercado Pago.
- Usar variables de entorno o secretos del proveedor de hosting.
- Separar credenciales de prueba/sandbox y producción.
- Validar precios del lado servidor, no solo desde el carrito del frontend.
- No confiar en precios, totales ni cantidades guardadas en `localStorage` como verdad final.
- Validar que los productos enviados existen y siguen disponibles.
- Planear validación de firma/autenticidad para webhooks.
- Registrar estados de pago de forma auditable.
- Evitar exponer tokens privados en `index.html`, `assets/js/main.js`, archivos JSON o repositorio.
- Definir manejo de errores: pago pendiente, pago rechazado, pago aprobado sin disponibilidad, expiración del link y pedido abandonado.

## 7. Preguntas abiertas para el owner

- ¿Quiere Terrazzo que el cliente pague antes de preparar el pedido?
- ¿El pago en línea aplicaría solo para pickup, solo para delivery o para ambos?
- ¿Quién confirma pedidos durante horas de alta demanda?
- ¿Qué pasa si el pago se aprueba pero un producto ya no está disponible?
- ¿Se necesitan cancelaciones o reembolsos?
- ¿El owner está dispuesto a pagar hosting backend/serverless y mantenimiento?
- ¿Se desea un panel Admin ahora o más adelante?
- ¿El staff necesita recibir alertas automáticas cuando un pago se aprueba?
- ¿Los precios pueden cambiar por promociones, eventos o disponibilidad?

## 8. Siguientes fases si el owner aprueba

### Phase 4B: Investigación de proveedor y spike técnico

- Revisar documentación actual de Mercado Pago para Checkout Pro en México.
- Confirmar requisitos de cuenta, comisiones, credenciales y pruebas sandbox.
- Definir hosting serverless candidato.
- Confirmar si el flujo será pickup, delivery o ambos.

### Phase 4C: Prueba de concepto serverless para crear preferencias

- Crear un endpoint serverless mínimo.
- Validar productos/precios del lado servidor.
- Crear una preferencia de pago de prueba.
- Devolver `init_point` o link de pago al frontend de prueba.

### Phase 4D: Botón de pago en frontend detrás de feature flag

- Agregar botón de pago solo si la bandera está activa.
- Mantener WhatsApp + transferencia como fallback.
- Evitar activar pago en producción hasta terminar pruebas.

### Phase 4E: Webhook y manejo de estado de pago

- Crear endpoint para notificaciones de Mercado Pago.
- Validar autenticidad de notificaciones.
- Registrar estados de pago.
- Definir mensajes para staff y cliente.

### Phase 4F: Pruebas del owner con sandbox/test credentials

- Probar pagos aprobados, rechazados y pendientes.
- Validar mensajes, tiempos de confirmación y operación del staff.
- Documentar pasos de soporte y fallas comunes.

### Phase 5: Planeación de Admin/gestión de pedidos

- Definir si el owner necesita panel Admin.
- Planear estados de pedido y permisos.
- Evaluar almacenamiento persistente.
- Separar administración de contenido, pedidos y pagos.

## 9. No objetivos

Este documento no implementa pagos.

No se agregan SDKs de pago.

No se agrega backend.

No se agregan funciones serverless.

No se agregan credenciales de Mercado Pago.

No se agregan archivos de entorno.

No se agrega botón de pago visible al usuario.

No se cambia `index.html`.

No se cambia `assets/js/main.js`.

No se cambia `assets/css/styles.css`.

No se cambia contenido JSON.

El checkout actual por WhatsApp + transferencia permanece sin cambios.
