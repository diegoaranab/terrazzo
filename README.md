# Terrazzo

Angular 22 standalone storefront for Terrazzo Urban Food & Drinks in Tehuacán, Puebla, built for GitHub Pages.

## Development

Use Node 24 LTS (24.15.0 or newer in the 24.x line; `.nvmrc` pins the tested runtime). Install dependencies and start the development server:

```bash
nvm use
npm ci
npm start
```

Open `http://localhost:4200/`. JSON and media use relative `assets/...` URLs, resolved against the document base in local development and production. Keep optimized assets under `assets/` committed; Angular copies them into the static build without moving or re-encoding the originals.

```bash
npm run test:ci   # Angular/Vitest unit tests, non-watch
npm test          # watch mode
npm run build     # production output: dist/terrazzo/browser
```

Production builds use `<base href="/terrazzo/">`. The single-page storefront does not need a router. Feature components live in `src/app/features/`; typed JSON loading, cart state and order generation live in `src/app/core/`. Bootstrap 5, Flickity 2 and GLightbox remain package-managed for functional parity. A scoped `@angular/build` override selects the Vite 8.3.5 security patch; recheck that override when updating Angular tooling.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds on pushes to `main` (or manual dispatch) and uploads **only** `dist/terrazzo/browser` using the official Pages Actions flow. The deployment uses the `github-pages` environment.

**One-time repository-owner step:** in Settings → Pages → Build and deployment → Source, select **GitHub Actions** instead of branch publishing. Do this when reviewing/merging the Angular migration; source files alone no longer constitute the deployable site. No repository settings are changed by this code.

The pull-request validation workflow installs dependencies, validates content and asset budgets, checks the image optimizer CLI, runs unit tests and builds production. Generated `dist/` and Angular caches are ignored.

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

Antes de una demo, grabación o entrega de avance, usar el [checklist manual de QA y demo](docs/demo-qa-checklist.md) para revisar desktop, mobile y el flujo de pedido por WhatsApp. Para presentar el MVP al owner sin abrir preguntas prematuras de pagos o backend, revisar el [paquete de preparación para demo comercial](docs/sales-demo-readiness.md).

Para pagos en línea futuros, revisar el [plan de arquitectura de pagos](docs/payment-architecture-plan.md) y la [investigación de proveedor de pagos](docs/payment-provider-research.md). Son documentos de planeación y no funcionalidades implementadas en el MVP actual.

Archivos actuales de contenido:

- `assets/menu.json`: productos del menú.
- `assets/events.json`: tarjetas de Eventos & Deportes.
- `assets/gallery.json`: imágenes de la galería.

Importante para GitHub Pages: las rutas de imágenes deben ser relativas y comenzar con `assets/`. Por ejemplo: `assets/gallery/foto.webp`. El build configura `/terrazzo/` como base de producción.

### Validación de Contenido

Después de editar `assets/menu.json`, `assets/events.json` o `assets/gallery.json`, validar el contenido con:

```bash
npm run validate:content
npm run validate:assets
```

El script revisa campos requeridos, IDs duplicados, categorías válidas del menú, rutas de imágenes y texto alternativo significativo en galería.

Las rutas PNG del menú se rechazan. Los presupuestos de medios se validan tanto en pull requests como antes de desplegar a Pages.

Pull requests ejecutan un workflow de GitHub Actions que corre esta validación de contenido, confirma que el CLI del optimizador de imágenes esté disponible y ejecuta las pruebas y el build de Angular. Si falla, corregir el JSON o las rutas de contenido antes de hacer merge.

### Menú

Cada elemento de `assets/menu.json` representa un producto del menú:

- `id`: identificador único del producto. Usar texto corto en minúsculas, sin espacios, por ejemplo `alitas-buffalo`.
- `category`: categoría usada por los filtros del menú.
- `name`: nombre visible del producto.
- `description`: descripción breve que aparece en la tarjeta del producto.
- `price`: precio numérico, sin símbolo de pesos.
- `img`: ruta de la imagen del producto. Debe usar WebP bajo `assets/menu/`.

Categorías válidas actuales:

- `hamburguesas`
- `alitas`
- `jochos`
- `nachos`
- `cocteleria`

Si se agrega una categoría nueva en `assets/menu.json`, también se deben actualizar los botones de filtro en `src/app/features/menu/menu.ts` para que la nueva categoría pueda seleccionarse en el sitio.

Las 33 imágenes del menú usan WebP bajo `assets/menu/`. `validate:content` rechaza rutas antiguas PNG y `validate:assets` limita el hero a 12 MiB, cada imagen del menú a 300 KiB y su total a 5 MiB. Ver [mediciones y proceso](docs/media-performance.md).

Ejemplo:

```json
{
    "id": "alitas-buffalo",
    "category": "alitas",
    "name": "Buffalo",
    "description": "Clásica salsa búfalo con mantequilla",
    "price": 105,
    "img": "assets/menu/alitas-buffalo.webp"
}
```

### Eventos & Deportes

Cada elemento de `assets/events.json` representa una tarjeta de Eventos & Deportes:

- `id`: identificador único del evento o promoción.
- `title`: título visible de la tarjeta.
- `date`: fecha, horario o etiqueta de recurrencia.
- `description`: texto breve que explica el evento, promo o transmisión.
- `img`: ruta de la imagen del evento. Debe comenzar con `assets/`.

Las tarjetas describen experiencias del lugar sin anunciar promociones ni fechas no verificadas. Pueden reutilizar fotografías existentes de `assets/gallery/` para evitar duplicar archivos. Confirmar eventos/promociones con el owner antes de publicarlos; ver [verificación de contenido](docs/content-verification.md).

Ejemplo:

```json
{
    "id": "transmisiones-deportivas",
    "title": "Partidos en vivo",
    "date": "Consulta transmisiones por WhatsApp",
    "description": "Disfruta los deportes en nuestras pantallas con comida, drinks y ambiente Terrazzo.",
    "img": "assets/gallery/interior-venue-9.webp"
}
```

### Galería

Cada elemento de `assets/gallery.json` representa una imagen de la galería:

- `id`: identificador único de la imagen.
- `src`: ruta de la imagen. Debe comenzar con `assets/`.
- `alt`: texto alternativo para accesibilidad y carga fallida de imágenes.

El texto `alt` debe describir claramente lo que se ve en la imagen, por ejemplo `Mesa con burgers dentro de Terrazzo` en lugar de `foto 1`.

Ejemplo:

```json
{
    "id": "interior-burgers-table",
    "src": "assets/gallery/interior-burgers-table.webp",
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
5. Actualizar el JSON correspondiente con la ruta `assets/...`.
6. Committear los archivos WebP optimizados bajo `assets/`.

No committear `_incoming/`: esa carpeta está ignorada por Git porque contiene imágenes originales pesadas que GitHub Pages no necesita.
