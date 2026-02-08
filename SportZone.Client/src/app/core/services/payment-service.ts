import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  processPayment(paymentData: any) {
    return this.http.post<{ paymentUrl: string }>(`${this.apiUrl}payments/process`, paymentData);
  }
}
