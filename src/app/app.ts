import { Component } from '@angular/core';
import { Hero } from './features/hero/hero';
import { Promo } from './features/home/promo';
import { Menu } from './features/menu/menu';
import { Cart } from './features/cart/cart';
import { Events } from './features/events/events';
import { Gallery } from './features/gallery/gallery';
import { Contact } from './features/contact/contact';
import { Footer } from './features/footer/footer';

@Component({
  selector: 'tz-app',
  imports: [Hero, Promo, Menu, Cart, Events, Gallery, Contact, Footer],
  template: `<tz-hero /><tz-promo /><tz-menu /><tz-events /><tz-gallery /><tz-contact /><tz-footer /><tz-cart />`
})
export class App {}
