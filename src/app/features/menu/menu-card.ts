import { Component, inject, input } from '@angular/core';
import { MenuItem } from '../../core/models';
import { CartService } from '../../core/cart.service';
import { formatCurrency } from '../../core/order';

@Component({
  selector: 'tz-menu-card',
  template: `
    <div class="card menu-card h-100 my-2">
      <div class="ratio ratio-4x3"><img loading="lazy" decoding="async" [src]="item().img" class="card-img-top object-fit-cover" [alt]="item().name"></div>
      <div class="card-body">
        <h3 class="h5 card-title">{{ item().name }}</h3>
        <p class="card-text small">{{ item().description }}</p>
      </div>
      <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
        <span class="menu-price">{{ currency(item().price) }}</span>
        <button class="btn btn-cta btn-sm btn-add-cart" [attr.aria-label]="'Añadir ' + item().name + ' al carrito'" (click)="cart.add(item())">Añadir</button>
      </div>
    </div>`
})
export class MenuCard {
  readonly item = input.required<MenuItem>();
  readonly cart = inject(CartService);
  readonly currency = formatCurrency;
}
