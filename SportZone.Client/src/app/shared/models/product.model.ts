export interface Product {
  id: number;
  name: string;
  brand : string;
  categoryId: number;
  categoryName: string;
  price: number;
  image?: string;
  discount?: number;
  isNew?: boolean;
  isDelete: boolean
}