import { Product, ProductSize } from "../shared/models/product.model";

export type Cart = {
    id: number;
    userId: string;
    items?: CartItem[];
}

export type CartItem = {
    productId: number;
    quantity: number;
    product?: Product;
    productSize : ProductSize;
}

