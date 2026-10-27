import { afterRenderEffect, Component, DestroyRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import GLightbox from 'glightbox';
import { ContentService } from '../../core/content.service';
import { Carousel } from '../../shared/carousel';

@Component({
  selector: 'tz-gallery', imports: [Carousel],
  template: `
    <section class="container section-space gallery-section" id="gallery" aria-label="Galería">
      <div class="section-heading"><div><p class="eyebrow">Dentro de Terrazzo</p><h2>Así se vive</h2></div><p>Explora la galería. Aquí está el ambiente.</p></div>
      <div id="gallery-carousel" class="gallery-carousel" role="region" aria-roledescription="carousel"
        aria-label="Fotos del lugar" [tzCarousel]="items()" [gallery]="true">
        @for (item of items(); track item.id; let index = $index) {
          <div class="carousel-cell">
            <a [href]="item.src" class="glightbox" data-gallery="terrazzo"
              [attr.aria-label]="'Abrir imagen ' + (index + 1) + ' de ' + items().length"
              (click)="open($event, index)">
              <div class="carousel-frame"><img [src]="item.src" [alt]="item.alt" loading="lazy" decoding="async"></div>
            </a>
          </div>
        }
      </div>
    </section>`
})
export class Gallery {
  readonly items = toSignal(inject(ContentService).gallery, { initialValue: [] });
  private lightbox?: ReturnType<typeof GLightbox>;
  constructor() {
    afterRenderEffect(() => {
      const items = this.items();
      this.lightbox?.destroy();
      // GLightbox needs its no-animation path to complete callbacks when CSS disables motion.
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lightbox = GLightbox({
        elements: items.map(item => ({ href: item.src, type: 'image', alt: item.alt })),
        openEffect: reducedMotion ? 'none' : 'zoom',
        closeEffect: reducedMotion ? 'none' : 'zoom',
        slideEffect: reducedMotion ? 'none' : 'slide'
      });
    });
    inject(DestroyRef).onDestroy(() => this.lightbox?.destroy());
  }
  open(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.lightbox?.openAt(index);
  }
}
