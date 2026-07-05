# Checklist manual de QA y demo para owners

Guía práctica para revisar el MVP estático de Terrazzo antes de una demo, grabación o entrega de avance. Usar en desktop y mobile para confirmar que la experiencia principal sigue lista sin mover pagos, backend, admin o Angular.

## 1. Preparación

- Hacer pull del último `main`.
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
- Confirmar que esta revisión no cambia comportamiento del sitio, contenido, estilos ni scripts.

## 2. Desktop QA

- El video hero es visible.
- El texto del hero se lee claramente sobre el video.
- Los botones CTA están visibles.
- El menú carga productos.
- Los filtros de categoría del menú funcionan.
- Se pueden agregar productos al carrito.
- El aumento y disminución de cantidad funcionan.
- Se puede eliminar un producto del carrito.
- El checkout por WhatsApp abre con:
  - Código de pedido.
  - Pedido desglosado por producto.
  - Total estimado.
  - Lenguaje de transferencia y confirmación.
- La sección Eventos & Deportes carga con el copy actualizado.
- El carrusel de galería carga.
- GLightbox abre imágenes de la galería.
- La sección de contacto/mapa es visible.

## 3. Mobile QA

- El hero se ve correcto en mobile.
- El carrusel del menú funciona.
- Los filtros del menú siguen funcionando.
- El carrusel de Eventos & Deportes funciona.
- El carrusel de galería funciona.
- El botón del carrito es fácil de usar.
- El drawer del carrito es usable.
- El checkout por WhatsApp funciona.

## 4. Guion corto de demo para owner

1. Mostrar marca y hero: presentar Terrazzo como una experiencia urbana de food & drinks en Tehuacán.
2. Explicar la experiencia: comida, drinks, deportes, eventos y ambiente para reunirse.
3. Mostrar los filtros del menú para navegar por hamburguesas, alitas, jochos, nachos y coctelería.
4. Agregar algunos productos al carrito.
5. Abrir el flujo de pedido por WhatsApp y mostrar que incluye código, detalle, total estimado y texto de transferencia/confirmación.
6. Mostrar Eventos & Deportes para explicar promos, transmisiones y fechas especiales.
7. Mostrar la galería y abrir una imagen con lightbox.
8. Explicar mantenibilidad: por ahora el contenido se actualiza desde JSON; más adelante puede convertirse en panel Admin.
9. Explicar siguientes features pagadas posibles: pago en línea y sistema administrativo.

## 5. Limitaciones conocidas del MVP

- Por ahora el contenido se edita desde archivos JSON.
- Los pagos en línea todavía no están implementados.
- El panel Admin todavía no está implementado.
- El video hero necesita optimización futura porque el asset actual es pesado.
- Algunas imágenes del menú todavía son PNG y pueden optimizarse después.

## 6. Comandos útiles

```bash
npm ci
npm run validate:content
npm run optimize:images -- --help
```
