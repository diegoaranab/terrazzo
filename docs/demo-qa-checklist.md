# Checklist manual de QA y demo para owners

Guia practica para revisar el MVP estatico de Terrazzo antes de una demo, grabacion o entrega de avance. Usar en desktop y mobile para confirmar que la experiencia principal sigue lista sin mover pagos, backend, admin o Angular.

## 1. Preparacion

- Hacer pull del ultimo `main`.
- Instalar dependencias:

```bash
npm ci
```

- Validar contenido:

```bash
npm run validate:content
```

- Servir el sitio localmente o abrir el sitio desplegado en GitHub Pages.
- Probar al menos un viewport desktop y uno mobile.
- Confirmar que esta revision no cambia comportamiento del sitio, contenido, estilos ni scripts.

## 2. Desktop QA

- El video hero es visible.
- El texto del hero se lee claramente sobre el video.
- Los botones CTA estan visibles.
- El menu carga productos.
- Los filtros de categoria del menu funcionan.
- Se pueden agregar productos al carrito.
- El aumento y disminucion de cantidad funcionan.
- Se puede eliminar un producto del carrito.
- El checkout por WhatsApp abre con:
  - Codigo de pedido.
  - Pedido desglosado por producto.
  - Total estimado.
  - Lenguaje de transferencia y confirmacion.
- La seccion Eventos & Deportes carga con el copy actualizado.
- El carrusel de galeria carga.
- GLightbox abre imagenes de la galeria.
- La seccion de contacto/mapa es visible.

## 3. Mobile QA

- El hero se ve correcto en mobile.
- El carrusel del menu funciona.
- Los filtros del menu siguen funcionando.
- El carrusel de Eventos & Deportes funciona.
- El carrusel de galeria funciona.
- El boton del carrito es facil de usar.
- El drawer del carrito es usable.
- El checkout por WhatsApp funciona.

## 4. Guion corto de demo para owner

1. Mostrar marca y hero: presentar Terrazzo como una experiencia urbana de food & drinks en Tehuacan.
2. Explicar la experiencia: comida, drinks, deportes, eventos y ambiente para reunirse.
3. Mostrar los filtros del menu para navegar por hamburguesas, alitas, jochos, nachos y cocteleria.
4. Agregar algunos productos al carrito.
5. Abrir el flujo de pedido por WhatsApp y mostrar que incluye codigo, detalle, total estimado y texto de transferencia/confirmacion.
6. Mostrar Eventos & Deportes para explicar promos, transmisiones y fechas especiales.
7. Mostrar la galeria y abrir una imagen con lightbox.
8. Explicar mantenibilidad: por ahora el contenido se actualiza desde JSON; mas adelante puede convertirse en panel Admin.
9. Explicar siguientes features pagadas posibles: pago en linea y sistema administrativo.

## 5. Limitaciones conocidas del MVP

- Por ahora el contenido se edita desde archivos JSON.
- Los pagos en linea todavia no estan implementados.
- El panel Admin todavia no esta implementado.
- El video hero necesita optimizacion futura porque el asset actual es pesado.
- Algunas imagenes del menu todavia son PNG y pueden optimizarse despues.

## 6. Comandos utiles

```bash
npm ci
npm run validate:content
npm run optimize:images -- --help
```
