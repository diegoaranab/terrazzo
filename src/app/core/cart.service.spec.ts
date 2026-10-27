import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CART_KEY, CartService } from './cart.service';

const burger = { id: 'burger', name: 'Burger', price: 85, img: 'assets/burger.png' };
const wings = { id: 'wings', name: 'Alitas', price: 105, img: 'assets/wings.png' };

describe('CartService', () => {
  beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
  it('adds a product and increments an existing product without duplicating the line', () => {
    const cart = new CartService();
    cart.add(burger); cart.add(burger);
    expect(cart.items()).toEqual([{ ...burger, qty: 2 }]);
    expect(cart.count()).toBe(2);
  });
  it('calculates item counts, subtotals and totals across products', () => {
    const cart = new CartService();
    cart.add(burger); cart.add(wings); cart.updateQuantity('burger', 3);
    expect(cart.count()).toBe(4);
    expect(cart.items()[0]!.qty * cart.items()[0]!.price).toBe(255);
    expect(cart.total()).toBe(360);
  });
  it('updates quantities using the original integer and minimum-one behavior', () => {
    const cart = new CartService(); cart.add(burger);
    for (const quantity of [0, -8, NaN, Infinity]) {
      cart.updateQuantity('burger', quantity);
      expect(cart.items()[0]!.qty).toBe(1);
    }
    cart.updateQuantity('burger', 3.9);
    expect(cart.items()[0]!.qty).toBe(3);
    cart.updateQuantity('missing', 10);
    expect(cart.count()).toBe(3);
  });
  it('removes items and clears the persisted cart', () => {
    const cart = new CartService(); cart.add(burger); cart.add(wings);
    cart.remove('burger');
    expect(cart.items().map(item => item.id)).toEqual(['wings']);
    cart.clear();
    expect(cart.items()).toEqual([]);
    expect(cart.total()).toBe(0);
    expect(cart.count()).toBe(0);
    expect(localStorage.getItem(CART_KEY)).toBe('[]');
  });
  it('loads the exact legacy storage key and shape, including legacy image paths', () => {
    const legacy = [{ ...burger, img: '/terrazzo/assets/burger.png', qty: 2 }];
    localStorage.setItem('terrazzo_cart_v1', JSON.stringify(legacy));
    const cart = new CartService();
    expect(cart.items()).toEqual(legacy);
    cart.add(burger);
    expect(new CartService().items()[0]!.qty).toBe(3);
  });
  it('recovers from malformed storage and ignores invalid persisted entries', () => {
    for (const value of ['bad json', '{}', 'null']) {
      localStorage.setItem(CART_KEY, value);
      expect(new CartService().items()).toEqual([]);
    }
    localStorage.setItem(CART_KEY, JSON.stringify([null, { ...burger, qty: 0 }, { ...wings, qty: 2 }]));
    expect(new CartService().count()).toBe(2);
  });
  it('keeps working when storage access or persistence is denied', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    const cart = new CartService(); cart.add(burger);
    expect(cart.total()).toBe(85);
  });
});
