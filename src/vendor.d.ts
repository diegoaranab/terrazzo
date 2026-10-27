declare module 'glightbox' {
  interface LightboxElement { href: string; type: 'image'; alt: string; }
  interface Lightbox { openAt(index: number): void; destroy(): void; }
  export default function GLightbox(options: { elements: LightboxElement[] }): Lightbox;
}
