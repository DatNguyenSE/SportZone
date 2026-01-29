import { inject, Injectable, signal } from '@angular/core';
import { Category } from '../../shared/models/category.moedel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  categories = signal<Category[]>([]); 


  getCategories() {
    this.http.get<Category[]>(`${this.baseUrl}categories`).subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.error('Lỗi lấy danh mục:', err);
      }
    });
  }
}
