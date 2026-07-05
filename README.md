# Terrazzo

Static MVP website for Terrazzo Urban Food & Drinks in Tehuacán, Puebla, served directly from GitHub Pages.

## Development

Install the project tooling:

```bash
npm install
```

This project does not use a frontend build step. Site files are served directly from the repository, and optimized assets under `assets/` are committed because GitHub Pages serves them directly.

## Image Optimization

Use the image optimization pipeline when adding future raw photos or artwork. This workflow generates optimized WebP files without changing the current site behavior, UI, cart, carousel behavior, gallery behavior, or content.

Place raw images in one of these gitignored folders:

- `_incoming/events`
- `_incoming/gallery`
- `_incoming/menu`
- `_incoming/hero`

Preview the work first:

```bash
npm run optimize:images -- --dry-run
```

Generate optimized WebP files:

```bash
npm run optimize:images
```

Use `--force` only when intentionally replacing existing optimized files:

```bash
npm run optimize:images -- --force
```

Recommended output widths:

- events: 1200px wide
- gallery: 1600px wide
- menu: 1000px wide
- hero/poster: 1920px wide

The `_incoming/` folder is gitignored because raw images are usually heavy and are not needed by GitHub Pages. The optimized WebP files generated under `assets/` should be committed so the static site can serve them directly.

## Mantenimiento de Contenido

En este MVP estático, el contenido principal se mantiene desde archivos JSON estructurados. Esto permite actualizar menú, eventos y galería sin cambiar la lógica del sitio. En una versión pagada o completa, esta misma estructura puede convertirse en un panel Admin para que una persona no técnica actualice menú, eventos y galería sin tocar código.

Antes de una demo, grabación o entrega de avance, usar el [checklist manual de QA y demo](docs/demo-qa-checklist.md) para revisar desktop, mobile y el flujo de pedido por WhatsApp.

Archivos actuales de contenido:

- `assets/menu.json`: productos del menú.
- `assets/events.json`: tarjetas de Eventos & Deportes.
- `assets/gallery.json`: imágenes de la galería.

Importante para GitHub Pages: las rutas de imágenes deben conservar el prefijo `/terrazzo/...`. Por ejemplo: `/terrazzo/assets/gallery/foto.webp`.

### Validación de Contenido

Después de editar `assets/menu.json`, `assets/events.json` o `assets/gallery.json`, validar el contenido con:

```bash
npm run validate:content
```

El script revisa campos requeridos, IDs duplicados, categorías válidas del menú, rutas de imágenes y texto alternativo significativo en galería.

Las imágenes PNG del menú actualmente generan advertencias solamente y no bloquean la validación.

Pull requests ejecutan un workflow de GitHub Actions que corre esta validación de contenido y confirma que el CLI del optimizador de imágenes esté disponible. Si falla, corregir el JSON o las rutas de contenido antes de hacer merge.

### Menú

Cada elemento de `assets/menu.json` representa un producto del menú:

- `id`: identificador único del producto. Usar texto corto en minúsculas, sin espacios, por ejemplo `alitas-buffalo`.
- `category`: categoría usada por los filtros del menú.
- `name`: nombre visible del producto.
- `description`: descripción breve que aparece en la tarjeta del producto.
- `price`: precio numérico, sin símbolo de pesos.
- `img`: ruta de la imagen del producto. Debe mantener el prefijo `/terrazzo/...`.

Categorías válidas actuales:

- `hamburguesas`
- `alitas`
- `jochos`
- `nachos`
- `cocteleria`

Si se agrega una categoría nueva en `assets/menu.json`, también se deben actualizar los botones de filtro en `index.html` para que la nueva categoría pueda seleccionarse en el sitio.

Nota: actualmente varias imágenes del menú todavía viven como PNG directamente bajo `assets/`. Si se optimizan o reemplazan en el futuro, preferir WebP y una ruta más organizada como `/terrazzo/assets/menu/alitas-buffalo.webp`.

Ejemplo:

```json
{
    "id": "alitas-buffalo",
    "category": "alitas",
    "name": "Buffalo",
    "description": "Clásica salsa búfalo con mantequilla",
    "price": 105,
    "img": "/terrazzo/assets/menu/alitas-buffalo.webp"
}
```

### Eventos & Deportes

Cada elemento de `assets/events.json` representa una tarjeta de Eventos & Deportes:

- `id`: identificador único del evento o promoción.
- `title`: título visible de la tarjeta.
- `date`: fecha, horario o etiqueta de recurrencia.
- `description`: texto breve que explica el evento, promo o transmisión.
- `img`: ruta de la imagen del evento. Debe mantener el prefijo `/terrazzo/...`.

En el MVP, estas tarjetas pueden mezclar eventos próximos, promociones recurrentes o ejemplos de eventos pasados. Esto ayuda a mostrar el tipo de experiencia que Terrazzo ofrece aunque no todos los eventos sean fechas futuras.

Ejemplo:

```json
{
    "id": "transmisiones-deportivas",
    "title": "Partidos en vivo",
    "date": "Días de juego · desde 13:00 h",
    "description": "Transmisiones deportivas, finales y partidos especiales con pantalla, comida, drinks y promos durante el juego.",
    "img": "/terrazzo/assets/events/transmisiones-deportivas.webp"
}
```

### Galería

Cada elemento de `assets/gallery.json` representa una imagen de la galería:

- `id`: identificador único de la imagen.
- `src`: ruta de la imagen. Debe mantener el prefijo `/terrazzo/...`.
- `alt`: texto alternativo para accesibilidad y carga fallida de imágenes.

El texto `alt` debe describir claramente lo que se ve en la imagen, por ejemplo `Mesa con burgers dentro de Terrazzo` en lugar de `foto 1`.

Ejemplo:

```json
{
    "id": "interior-burgers-table",
    "src": "/terrazzo/assets/gallery/interior-burgers-table.webp",
    "alt": "Mesa con burgers dentro de Terrazzo"
}
```

### Flujo de Imágenes

Para agregar o reemplazar imágenes, usar el pipeline existente de optimización:

1. Colocar las imágenes originales en la carpeta correspondiente:
   - `_incoming/events`
   - `_incoming/gallery`
   - `_incoming/menu`
   - `_incoming/hero`
2. Revisar lo que se generaría sin escribir archivos:

```bash
npm run optimize:images -- --dry-run
```

3. Generar las imágenes WebP optimizadas:

```bash
npm run optimize:images
```

4. Confirmar que los archivos optimizados quedaron bajo `assets/`.
5. Actualizar el JSON correspondiente con la ruta `/terrazzo/assets/...`.
6. Committear los archivos WebP optimizados bajo `assets/`.

No committear `_incoming/`: esa carpeta está ignorada por Git porque contiene imágenes originales pesadas que GitHub Pages no necesita.
