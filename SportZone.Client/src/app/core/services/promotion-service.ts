import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Promotion } from '../../shared/models/promotion.model';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  promotions = signal<Promotion[]>([]);

  getPromotions() {
    return this.http.get<Promotion[]>(`${this.baseUrl}promotions/active-promotions`);
  }

  getPromotionByCode(code: string) {
    return this.http.get<Promotion>(`${this.baseUrl}promotions/code/${code}`);
  }
}

