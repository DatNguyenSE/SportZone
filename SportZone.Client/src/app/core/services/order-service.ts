import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  addOrder(code : string, paymentMethodId: number) {
    return this.http.post<Order>(`${this.apiUrl}order/add?code=${code}&paymentMethodId=OnlineBanking`, {});
  }

}

