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
  productSizes?: ProductSize[];
  peatured?: string;
}

export interface ProductSize {
  id: number;
  sizeName: string;
  quantity: number;
}
