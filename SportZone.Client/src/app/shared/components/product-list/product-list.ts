import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service'; // Import Service của bạn
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService); // Inject thêm service category

  private readonly FOOTBALL_ID_GOP = 999;

  // Lấy ID từ URL
  categoryId = toSignal(
    this.route.params.pipe(map(p => +p['id'] || 0)), 
    { initialValue: 0 }
  );

  products = signal<any[]>([]);
  
  // SỬA: Dùng signal thông thường, mặc định là đang tải
  categoryName = signal<string>('ĐANG TẢI...');

  constructor() {
    effect(() => {
      const id = this.categoryId();
      
      // Nếu chưa có ID hợp lệ thì dừng
      if (id === 0) return;

      // Reset dữ liệu để UX mượt hơn (tránh hiện dữ liệu cũ của trang trước)
      this.products.set([]);
      this.categoryName.set('ĐANG TẢI...'); 

      // --- 1. XỬ LÝ TÊN DANH MỤC ---
      if (id === this.FOOTBALL_ID_GOP) {
        // Nếu là mã gộp: Set cứng tên
        this.categoryName.set('GIÀY BÓNG ĐÁ');
      } else {
        // Nếu là ID thường: Gọi API lấy tên Category
        // Giả sử API trả về object có thuộc tính 'categoryName' hoặc 'name'
        this.categoryService.getCategoryById(id).subscribe({
          next: (cateData: any) => {
            // Hãy kiểm tra chính xác API trả về key tên là gì (name hay categoryName)
            this.categoryName.set(cateData.categoryName || cateData.name);
          },
          error: (err) => {
            console.error('Lỗi lấy tên danh mục:', err);
            this.categoryName.set('DANH MỤC'); // Fallback nếu lỗi
          }
        });
      }

      // --- 2. XỬ LÝ DANH SÁCH SẢN PHẨM (Logic cũ của bạn) ---
      if (id === this.FOOTBALL_ID_GOP) {
        this.loadFootballProducts();
      } else {
        this.productService.getProductsByCategoryId(id).subscribe({
          next: (data) => this.products.set(data),
          error: (err) => console.error('Lỗi lấy sản phẩm:', err)
        });
      }

    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  async loadFootballProducts() {
    const realIds = [1, 2, 3]; // ID thật: IC, FG, TF
    try {
      const requests = realIds.map(id => 
        this.productService.getProductsByCategoryId(id).toPromise()
      );
      
      const results = await Promise.all(requests);
      // Gộp mảng và lọc null
      const merged = results.filter(res => res != null).flat();
      this.products.set(merged);
    } catch (error) {
      console.error('Lỗi khi gộp sản phẩm:', error);
    }
  }
}