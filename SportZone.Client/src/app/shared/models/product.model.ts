

export interface Product {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  price: number;
  image: string;
  discount?: number;
  isNew?: boolean;
}