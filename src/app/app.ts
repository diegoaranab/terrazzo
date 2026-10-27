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
  template: `
    <a class="skip-link" href="#interactive-menu">Ir al menú</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="wordmark" href="#top" aria-label="Terrazzo, inicio">TERRAZZO<span>Urban Food & Drinks</span></a>
        <nav aria-label="Navegación principal">
          <a href="#interactive-menu">Menú</a><a href="#experiencias">Experiencias</a>
          <a href="#gallery">Galería</a><a href="#ubicacion">Ubicación</a>
        </nav>
        <a class="header-contact" href="https://wa.me/522381897602">WhatsApp ↗</a>
      </div>
    </header>
    <main id="top"><tz-hero /><tz-promo /><tz-menu /><tz-events /><tz-gallery /><tz-contact /></main>
    <tz-footer /><tz-cart />`
})
export class App {}
