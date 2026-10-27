import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { PHONE_WA } from '../../core/order';
import { Carousel } from '../../shared/carousel';

@Component({
  selector: 'tz-events', imports: [Carousel],
  template: `
    <section id="experiencias" class="section-space experiences"><div class="container">
      <div class="section-heading"><div><p class="eyebrow">El plan se arma aquí</p><h2>Experiencias &amp; Eventos</h2></div><p>Comida, drinks y tu gente.</p></div>
      <div class="row g-4" id="event-grid" [tzCarousel]="events()">
        @for (event of events(); track event.id) {
          <div class="col-md-6 col-xl-4 carousel-cell">
            <div class="card menu-card experience-card h-100 my-2">
              <div class="ratio ratio-4x3"><img loading="lazy" decoding="async" [src]="event.img" class="card-img-top object-fit-cover" [alt]="event.title"></div>
              <div class="card-body">
                <h3 class="h5 card-title">{{ event.title }}</h3>
                <p class="event-meta small mb-2">{{ event.date }}</p>
                <p class="card-text small">{{ event.description }}</p>
              </div>
              <div class="card-footer bg-transparent border-0 text-end">
                <a [href]="reservation(event.title)" class="experience-link">Consultar por WhatsApp</a>
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
