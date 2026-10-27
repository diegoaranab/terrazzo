import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../core/content.service';
import { MenuCategory } from '../../core/models';
import { Carousel } from '../../shared/carousel';
import { MenuCard } from './menu-card';

@Component({
  selector: 'tz-menu', imports: [Carousel, MenuCard],
  template: `
    <section id="interactive-menu" class="container section-space menu-section">
      <div class="section-heading"><div><p class="eyebrow">Food &amp; drinks</p><h2>El menú</h2></div><p>Burgers, alitas, jochos, nachos y coctelería.</p></div>
      <div class="filter-btns" role="group" aria-label="Categorías del menú">
        @for (category of categories; track category.id) {
          <button class="btn btn-outline-light" [class.active]="selected() === category.id"
            [attr.aria-pressed]="selected() === category.id" [attr.data-filter]="category.id" (click)="select(category.id)">{{ category.label }}</button>
        }
      </div>
      <div class="row g-4" id="menu-grid" [tzCarousel]="carouselContent()">
        @for (item of items(); track item.id) {
          <tz-menu-card class="col-sm-6 col-lg-4 menu-item carousel-cell"
            [hidden]="item.category !== selected()" [item]="item" />
        }
      </div>
    </section>`
})
export class Menu {
  readonly items = toSignal(inject(ContentService).menu, { initialValue: [] });
  readonly selected = signal<MenuCategory>('hamburguesas');
  readonly carouselContent = computed(() => ({ items: this.items(), category: this.selected() }));
  readonly carousel = viewChild(Carousel);
  readonly categories: { id: MenuCategory; label: string }[] = [
    { id: 'hamburguesas', label: 'Hamburguesas' }, { id: 'alitas', label: 'Alitas' },
    { id: 'jochos', label: 'Jochos' }, { id: 'nachos', label: 'Nachos' }, { id: 'cocteleria', label: 'Coctelería' }
  ];
  select(category: MenuCategory): void {
    if (category === this.selected()) return;
    this.carousel()?.reset();
    this.selected.set(category);
  }
}
