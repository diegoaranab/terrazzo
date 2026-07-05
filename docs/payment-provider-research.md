# Investigación de Proveedor de Pagos

Documento de investigación interna para Terrazzo Urban Food & Drinks. Revisado el 2026-07-05 con documentación oficial disponible de Mercado Pago, Vercel, Netlify y AWS.

Este documento no implementa pagos. Su objetivo es preparar la conversación técnica y comercial para después de la demo del MVP, únicamente si el owner muestra interés real en contratar el servicio o evolucionar el sitio a una aplicación más completa. No es una lista de preguntas para presentar antes de vender el MVP.

## 1. Propósito

Terrazzo hoy opera como MVP estático en GitHub Pages. El checkout actual arma el pedido en el navegador y abre WhatsApp para que el staff confirme disponibilidad, total final y datos de transferencia.

Este documento ayuda a comparar cuatro caminos posibles para una etapa posterior:

- Mantener WhatsApp + transferencia como flujo principal.
- Usar links de pago manuales cuando el staff ya confirmó el pedido.
- Construir una prueba de concepto de Mercado Pago Checkout Pro con backend/serverless.
- Diferir pagos hasta una fase de Admin o gestión de pedidos.

La decisión debe ser comercial y operativa antes que técnica: primero se muestra el MVP, se valida si el owner tiene interés en contratar o ampliar el sistema, y solo después se conversa si el pago en línea resuelve un problema real para Terrazzo.

## 2. Opciones de pago a comparar

| Opción | Cómo funcionaría | Ventajas | Riesgos / costo | Fit para el MVP |
| --- | --- | --- | --- | --- |
| WhatsApp + transferencia | El cliente envía pedido por WhatsApp; staff confirma total, disponibilidad y transferencia. | Cero integración, sin credenciales, sin backend, control humano del pedido. | Confirmación manual, posible fricción para clientes, staff debe revisar pagos. | Mejor opción por defecto mientras se valida interés comercial. |
| Links manuales de Mercado Pago | Staff recibe pedido por WhatsApp, confirma disponibilidad y comparte un link de pago creado manualmente. | Cobro en línea sin tocar el sitio ni exponer credenciales; prueba operativa de comisiones y tiempos. | El link puede quedar desconectado del carrito exacto; sigue requiriendo seguimiento manual. | Buen paso intermedio si el owner quiere pago en línea con bajo riesgo después de ver valor en el MVP. |
| Mercado Pago Checkout Pro con backend/serverless | El frontend envía el pedido a un endpoint seguro; el backend valida precios, crea una preferencia y redirige a Mercado Pago. | Flujo integrado, credenciales protegidas, posibilidad de webhooks y estados de pago. | Requiere cuenta, credenciales, hosting serverless, pruebas sandbox, monitoreo y manejo de errores. | Fit solo si el owner aprueba pago integrado y mantenimiento mínimo. |
| Diferir pagos hasta Admin/order management | No se construye pago ahora; se planea junto con pedidos, estados y vista de staff. | Evita deuda operativa; permite diseñar pagos con gestión completa. | Retrasa cobro en línea; puede posponer aprendizaje si pagos son urgentes. | Buen camino si el problema principal es operación interna, no cobro. |

## 3. Mercado Pago Checkout Pro research checklist

Antes de implementar cualquier prueba de Checkout Pro, verificar:

- [ ] Account requirements: Checkout Pro requiere una cuenta de vendedor de Mercado Pago y SSL para el sitio/flujo conectado.
- [ ] Test/sandbox credentials: confirmar que existe aplicación en "Tus integraciones", credenciales de prueba y cuenta comprador de prueba para simular pagos.
- [ ] Production credentials: confirmar si el owner puede activar, compartir y rotar credenciales de producción sin commitearlas.
- [ ] Preference creation requirements: cada pedido necesita una `preference` creada del lado servidor/backend; la preferencia debe incluir productos, cantidades, precios y configuraciones necesarias.
- [ ] Redirect/return URLs: definir URLs de retorno para éxito, pendiente y error usando `back_urls`; estas URLs deben pertenecer a un destino controlado por Terrazzo.
- [ ] Webhook/notification requirements: definir endpoint público para notificaciones de pago; Mercado Pago puede enviar eventos cuando un pago se crea o cambia de estado.
- [ ] Payment status handling: mapear estados mínimos para operación: pendiente, aprobado, rechazado, cancelado, reembolsado y expirado/abandonado.
- [ ] Refund/cancellation handling: decidir si Terrazzo necesita reembolsos totales o parciales, quién los ejecuta y en qué casos aplican.
- [ ] Fees/commissions to confirm with owner: revisar tarifas vigentes en la cuenta de Terrazzo antes de aprobar el flujo. Como referencia pública de Link de pago México al 2026-07-05, Mercado Pago indica que las comisiones varían por plazo de liberación y medio de pago, sin costo mensual y con cobro solo cuando hay venta. Estos valores pueden cambiar y deben confirmarse en la cuenta real.
- [ ] Checkout UX on mobile: probar en teléfono real que el salto a Mercado Pago, login/invitado, regreso al sitio y mensaje final sean claros.
- [ ] Whether pickup, delivery, or both are supported operationally: definir si el pago aplica para pickup, delivery o ambos; si hay delivery, confirmar domicilio, zona, costo de envío y responsable de entrega.

Notas prácticas:

- No poner Access Token, Client Secret ni credenciales en `index.html`, `assets/js/main.js`, JSON o repositorio.
- El carrito de `localStorage` no debe ser la fuente final de precios; el backend debe validar productos y totales.
- Si se usa pago integrado, el staff necesita una forma confiable de saber que un pedido fue pagado antes de prepararlo.

## 4. Opciones de hosting serverless/backend a evaluar

| Opción | Complejidad | Costo / mantenimiento | Variables de entorno / secretos | Fit para este MVP |
| --- | --- | --- | --- | --- |
| Vercel serverless functions | Baja a media si se crea un endpoint pequeño. Buena experiencia para funciones HTTP y previews. | Puede iniciar simple; requiere revisar límites, plan y costos si crece. | Soporta variables por proyecto/equipo y ambientes Production, Preview y Development. | Buen fit para una prueba 4C si se acepta mover o duplicar deploy fuera de GitHub Pages para funciones. |
| Netlify functions | Baja a media. Encaja bien con sitios estáticos y funciones versionadas con el repo. | Puede iniciar simple; requiere revisar plan, límites y monitoreo. | Soporta variables por sitio/equipo, contextos de deploy, scopes para Functions y marcado de valores secretos. | Buen fit para MVP estático si el equipo prefiere una plataforma tipo Jamstack. |
| AWS Lambda + API Gateway | Media a alta. Muy flexible, pero exige más configuración de IAM, API Gateway, logs, dominios y despliegue. | Pago por uso y muy escalable, pero con más mantenimiento operacional. | Lambda soporta environment variables y AWS recomienda Secrets Manager para datos sensibles como API keys/tokens. | Poderoso, pero probablemente demasiado pesado para la primera prueba de Terrazzo. |
| Mantener decisión de backend diferida | Nula ahora. Se documenta la decisión pendiente y no se crea infraestructura. | Sin costo técnico inmediato. | No aplica hasta elegir hosting. | Mejor fit si el owner aún no aprueba pagos integrados. |

No se debe implementar backend específico de proveedor en esta fase. La decisión mínima antes de Phase 4C es elegir una sola dirección de hosting y confirmar quién mantendrá secretos, logs y deploys.

## 5. Checklist post-demo si el owner muestra interés

Este checklist se usa después de mostrar el MVP y solo si el owner expresa interés en contratar, ampliar o cotizar el sistema. Antes de ese punto, la prioridad es vender el valor del MVP: experiencia visual, menú, carrito, WhatsApp, eventos, galería y facilidad de mantenimiento.

- [ ] ¿Quiere Terrazzo cobrar antes de preparar el pedido?
- [ ] ¿La transferencia sigue siendo aceptable por ahora?
- [ ] ¿Serían suficientes links manuales de Mercado Pago después de confirmar el pedido?
- [ ] ¿El staff tiene tiempo para monitorear pedidos pagados durante horas de trabajo?
- [ ] ¿Qué pasa si el pago se aprueba pero un producto ya no está disponible?
- [ ] ¿Terrazzo necesita reembolsos? ¿Totales, parciales o ambos?
- [ ] ¿Terrazzo necesita cobrar cuotas de delivery?
- [ ] ¿Terrazzo quiere un panel Admin antes de activar pagos?
- [ ] ¿El owner está dispuesto a pagar mantenimiento de backend/serverless?
- [ ] ¿El owner está listo para crear/configurar credenciales de Mercado Pago?

## 6. Ruta de decisión recomendada

Recomendación principal antes de la demo: mantener WhatsApp + transferencia como el flujo visible del MVP. Es suficiente para vender la idea, demostrar carrito funcional y evitar hablar de infraestructura antes de que exista interés comercial.

Si después de la demo el owner quiere pago en línea de bajo riesgo, probar primero links manuales de Mercado Pago. Ese experimento valida comisiones, tiempos de liberación, soporte del staff y casos de cliente sin cambiar el sitio.

Si después de la demo el owner quiere pago integrado, construir una prueba pequeña de Mercado Pago Checkout Pro con creación serverless de preferencias. Esa prueba debe cubrir solo el camino mínimo: validar pedido, crear preferencia, redirigir al checkout y documentar estados básicos.

No construir Admin + pagos juntos salvo que el owner se comprometa a un sistema pagado completo. Mezclar gestión de pedidos, estados, disponibilidad, pagos y reembolsos en una sola fase aumenta alcance y riesgo.

## 7. Go / No-Go criteria for implementation

Go para iniciar Phase 4C si:

- [ ] El owner aprueba explícitamente la necesidad de pago en línea después de ver el MVP.
- [ ] La cuenta de proveedor y credenciales de prueba/producción están disponibles o el owner tiene fecha concreta para crearlas.
- [ ] El target de hosting/serverless está elegido.
- [ ] El flujo de pago está definido: pickup, delivery o ambos.
- [ ] El proceso de reembolso y producto no disponible está definido.

No-Go para iniciar implementación si:

- [ ] El owner no ha aprobado una implementación pagada.
- [ ] Las credenciales no están disponibles.
- [ ] El hosting/backend sigue sin decidirse.
- [ ] El workflow del staff para pedidos pagados no está claro.
- [ ] Transferencia o links manuales son suficientes por ahora.

## 8. Next phases

- Phase 4C: Serverless payment preference proof of concept.
- Phase 4D: Frontend payment button behind feature flag.
- Phase 4E: Webhook/payment status proof of concept.
- Phase 4F: Owner sandbox testing.
- Phase 5: Admin/order management planning.

## 9. Non-goals

- No payment implementation.
- No SDKs.
- No backend.
- No credentials.
- No payment button.
- No behavior changes.
- No cambios en `index.html`.
- No cambios en `assets/js/main.js`.
- No cambios en `assets/css/styles.css`.
- No cambios en JSON de contenido.
- No cambios al checkout actual por WhatsApp + transferencia.

## Fuentes oficiales revisadas

- Mercado Pago Developers - Checkout Pro overview: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/overview
- Mercado Pago Developers - Crear y configurar una preferencia de pago: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/create-payment-preference
- Mercado Pago Developers - URLs de retorno: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/configure-back-urls
- Mercado Pago Developers - Notificaciones de pago: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/payment-notifications
- Mercado Pago Developers - Prueba de integración: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/integration-test
- Mercado Pago Developers - Reembolsos y cancelaciones: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-settings/refunds-and-cancellations
- Mercado Pago Developers - Mostrar valor de envío: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/additional-settings/shipping-cost
- Mercado Pago Developers - Credenciales: https://www.mercadopago.com.mx/developers/es/docs/your-integrations/credentials
- Mercado Pago México - Link de pago: https://www.mercadopago.com.mx/herramientas-para-vender/link-de-pago
- Vercel Docs - Functions: https://vercel.com/docs/functions
- Vercel Docs - Environment variables: https://vercel.com/docs/environment-variables
- Netlify Docs - Functions overview: https://docs.netlify.com/build/functions/overview/
- Netlify Docs - Environment variables overview: https://docs.netlify.com/build/environment-variables/overview/
- AWS Docs - Lambda overview: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
- AWS Docs - API Gateway overview: https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html
- AWS Docs - Lambda environment variables: https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
