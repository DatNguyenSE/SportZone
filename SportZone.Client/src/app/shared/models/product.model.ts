export interface Product {
  id: number;
  name: string;
  brand : string;
  categoryId: number;
  categoryName?: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  discount?: number;
  isNew?: boolean;
  isDelete: boolean
}