import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from './models';

export const CART_KEY = 'terrazzo_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly state = signal<CartItem[]>(this.load());
  readonly items = this.state.asReadonly();
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.qty, 0));
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.qty * (Number(item.price) || 0), 0));

  add(item: Omit<CartItem, 'qty'>): void {
    const existing = this.items().find(line => line.id === item.id);
    this.save(existing
      ? this.items().map(line => line.id === item.id ? { ...line, qty: line.qty + 1 } : line)
      : [...this.items(), { id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 }]);
  }
  updateQuantity(id: string, quantity: number): void {
    this.save(this.items().map(item => item.id === id ? { ...item, qty: Math.max(1, quantity | 0) } : item));
  }
  remove(id: string): void { this.save(this.items().filter(item => item.id !== id)); }
  clear(): void { this.save([]); }

  private save(items: CartItem[]): void {
    this.state.set(items);
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
    catch { /* Keep the cart usable when browser storage is unavailable. */ }
  }
  private load(): CartItem[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(value)) return [];
      return value.filter((item): item is CartItem => !!item && typeof item === 'object'
        && typeof item.id === 'string' && typeof item.name === 'string'
        && typeof item.price === 'number' && Number.isFinite(item.price)
        && typeof item.img === 'string' && Number.isInteger(item.qty) && item.qty >= 1);
    } catch { return []; }
  }
}
