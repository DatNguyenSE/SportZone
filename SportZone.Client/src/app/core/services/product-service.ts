import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl
  products = signal<Product[]>([]); 


  getProducts() {
    this.http.get<Product[]>(`${this.baseUrl}products`).subscribe({
      next: (res) => {
        this.products.set(res);
      },
      error: (err) => {
        console.error('Lỗi lấy products:', err);
      }
    });

  }
  getProductsByCategoryId(categoryId: number | undefined){
    return this.http.get<Product[]>(`${this.baseUrl}products/category/`+ categoryId)
  }

  getProductsById(productId: number ){
    return this.http.get<Product>(`${this.baseUrl}products/`+ productId)
  }


  addProduct(productData: Product, file: File | null) {
    const formData = new FormData();
    
    // Append các trường bắt buộc (*)
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    
    // Append các trường string
    formData.append('brand', productData.brand || ''); 
    formData.append('description', productData.description || '');

    // Append các trường số
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('quantity', productData.quantity.toString());

    // Append file ảnh (Nếu có)
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Product>(this.baseUrl + 'add_imgage', formData);
  }


  updateProduct(id: number, productData: Product, file: File | null) {
    const formData = new FormData();
  
    // Append dữ liệu như lúc Create
    formData.append('id', id.toString()); // Một số BE cần ID trong body
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('brand', productData.brand || '');
    formData.append('description', productData.description || '');
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('quantity', productData.quantity.toString());

    // Nếu có chọn file ảnh MỚI thì gửi lên
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Product>(this.baseUrl + 'products/update/' + id, formData);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'products/delete/' + id);
  }
}