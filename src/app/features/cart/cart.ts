import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Offcanvas } from 'bootstrap';
import { CartService } from '../../core/cart.service';
import { checkoutUrl, formatCurrency } from '../../core/order';

@Component({ selector: 'tz-cart', templateUrl: './cart.html' })
export class Cart {
  readonly cart = inject(CartService);
  readonly currency = formatCurrency;
  readonly open = signal(false);
  private readonly drawer = viewChild.required<ElementRef<HTMLElement>>('drawer');
  private offcanvas?: Offcanvas;
  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const element = this.drawer().nativeElement;
      const show = () => this.open.set(true);
      const hide = () => this.open.set(false);
      element.addEventListener('show.bs.offcanvas', show);
      element.addEventListener('hidden.bs.offcanvas', hide);
      this.offcanvas = new Offcanvas(element);
      destroy.onDestroy(() => {
        element.removeEventListener('show.bs.offcanvas', show);
        element.removeEventListener('hidden.bs.offcanvas', hide);
        this.offcanvas?.hide();
        this.offcanvas?.dispose();
      });
    });
  }
  show(): void { this.offcanvas?.show(); }
  hide(): void { this.offcanvas?.hide(); }
  quantity(id: string, event: globalThis.Event): void {
    const input = event.target as HTMLInputElement;
    this.cart.updateQuantity(id, Number(input.value || 1));
    input.value = String(this.cart.items().find(item => item.id === id)?.qty ?? 1);
  }
  checkout(): void {
    if (!this.cart.items().length) return;
    const url = checkoutUrl(this.cart.items());
    this.cart.clear();
    window.location.href = url;
  }
}
