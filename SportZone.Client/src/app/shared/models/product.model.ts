export interface Product {
  id: number;
  name: string;
  brand : string;
  categoryId: number;
  categoryName?: string;
  description?: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  isDelete?: boolean;

  discount?: number;
  isNew?: boolean;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  reviewCount?: number;
  isAdiClub?: boolean; // Để hiện box voucher
}

export interface ProductSize {
  label: string;
  available: boolean;
}

export interface ProductColor {
  id: string;
  name: string; // VD: Team Solar Pink
  imageUrl: string;
}