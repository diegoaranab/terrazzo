import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { PHONE_WA } from '../../core/order';
import { Carousel } from '../../shared/carousel';

@Component({
  selector: 'tz-events', imports: [Carousel],
  template: `
    <section class="py-5 bg-dark"><div class="container">
      <h2 class="text-center mb-4">Eventos &amp; Deportes</h2>
      <div class="row g-4" id="event-grid" [tzCarousel]="events()">
        @for (event of events(); track event.id) {
          <div class="col-md-4 carousel-cell">
            <div class="card menu-card h-100 my-2">
              <div class="ratio ratio-4x3"><img loading="lazy" decoding="async" [src]="event.img" class="card-img-top object-fit-cover" [alt]="event.title"></div>
              <div class="card-body">
                <h3 class="h5 card-title">{{ event.title }}</h3>
                <p class="small mb-1"><i class="bi bi-calendar-event me-1"></i>{{ event.date }}</p>
                <p class="card-text small">{{ event.description }}</p>
              </div>
              <div class="card-footer bg-transparent border-0 text-end">
                <a [href]="reservation(event.title)" class="btn btn-cta btn-sm">Consultar por WhatsApp</a>
              </div>
            </div>
          </div>
        }
      </div>
    </div></section>`
})
export class Events {
  readonly events = toSignal(inject(ContentService).events, { initialValue: [] });
  reservation(title: string): string {
    return `https://wa.me/${PHONE_WA}?text=Quiero%20información%20sobre%20${encodeURIComponent(title)}`;
  }
}
