export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string; // Dùng để tạo link
}

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