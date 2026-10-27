export type MenuCategory = 'hamburguesas' | 'alitas' | 'jochos' | 'nachos' | 'cocteleria';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  img: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  img: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

// Preserve the shape stored by the original storefront, including carts without category/description.
export interface CartItem extends Pick<MenuItem, 'id' | 'name' | 'price' | 'img'> {
  qty: number;
}
