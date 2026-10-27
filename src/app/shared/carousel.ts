import { afterRenderEffect, DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import Flickity from 'flickity';

/** Owns exactly one Flickity instance; Angular owns the cells. */
@Directive({ selector: '[tzCarousel]', exportAs: 'carousel' })
export class Carousel {
  readonly tzCarousel = input<unknown>();
  readonly gallery = input(false);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private instance?: Flickity;
  private resizeTimer?: ReturnType<typeof setTimeout>;
  private readonly resize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.rebuild(), 150);
  };
  private readonly imageLoaded = () => this.equalise();

  constructor() {
    afterRenderEffect(() => {
      this.tzCarousel();
      this.rebuild();
    });
    window.addEventListener('resize', this.resize);
    this.element.addEventListener('load', this.imageLoaded, true);
    inject(DestroyRef).onDestroy(() => {
      window.removeEventListener('resize', this.resize);
      clearTimeout(this.resizeTimer);
      this.element.removeEventListener('load', this.imageLoaded, true);
      this.reset();
    });
  }

  // Call before changing Angular's cell collection, so it is restored from Flickity's viewport.
  reset(): void {
    this.instance?.destroy();
    this.instance = undefined;
    this.element.style.removeProperty('--carousel-card-height');
  }

  private rebuild(): void {
    this.reset();
    if (!this.element.children.length) return;
    const mobile = window.matchMedia('(max-width: 767.98px)').matches;
    if (!mobile && !this.gallery()) return;
    const width = window.innerWidth;
    this.instance = new Flickity(this.element, {
      cellSelector: '.carousel-cell:not([hidden])',
      cellAlign: 'center', contain: true, draggable: true, pageDots: true,
      prevNextButtons: this.gallery() && width >= 576,
      wrapAround: this.gallery(),
      groupCells: this.gallery() ? (width < 576 ? 1 : width < 992 ? 2 : 3) : false
    });
    this.instance.on('settle', this.imageLoaded);
    this.equalise();
  }

  private equalise(): void {
    if (!this.instance) return;
    this.element.style.removeProperty('--carousel-card-height');
    const cards = this.element.querySelectorAll<HTMLElement>('.carousel-cell:not([hidden]) .menu-card');
    let height = 0;
    cards.forEach(card => { height = Math.max(height, card.scrollHeight); });
    if (height) this.element.style.setProperty('--carousel-card-height', `${height}px`);
    this.instance.resize();
  }
}
