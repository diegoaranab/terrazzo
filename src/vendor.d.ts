declare module 'glightbox' {
  interface LightboxElement { href: string; type: 'image'; alt: string; }
  interface LightboxEffect { in: string; out: string; }
  interface Lightbox { openAt(index: number): void; destroy(): void; }
  export default function GLightbox(options: {
    elements: LightboxElement[];
    openEffect?: 'zoom' | 'none';
    closeEffect?: 'zoom' | 'none';
    slideEffect?: 'slide' | 'none';
    cssEfects?: {
      slide?: LightboxEffect;
      slideBack?: LightboxEffect;
    };
  }): Lightbox;
}
