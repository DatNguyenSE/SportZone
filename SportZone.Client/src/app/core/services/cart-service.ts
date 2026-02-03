import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../../types/cart';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;
  
  

  addToCart(productId: number, quantity: number = 1) {
    return this.http.post(`${this.baseUrl}cart/add`, { productId, quantity });
  }

  getCartItems() {
    return this.http.get<Cart>(`${this.baseUrl}cart`);
  }

  removeFromCart(productId: number) {
    return this.http.delete(`${this.baseUrl}cart/remove/${productId}`);
  }

  clearCart() {
    return this.http.delete(`${this.baseUrl}cart/clear`);
  }

  updateCartItem(productId: number, quantity: number) : Observable<any> {
    return this.http.post(`${this.baseUrl}cart/update-item`, { productId, quantity });
  }
  
}