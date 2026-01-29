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
}
