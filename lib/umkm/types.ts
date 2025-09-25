export interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  location: string;
  whatsappNumber: string;
  tagline: string;
  heroImage: string;
  description: string;
  highlights: string[];
  products: Product[];
}
