import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Features } from '../../models/features.model';
import { Product } from '../../models/product.model';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-product-fetures',
  standalone: true, // Thêm nếu bạn dùng standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './product-fetures.html',
  styleUrl: './product-fetures.css',
})
export class ProductFeatures implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private router = inject(Router);
  private toast = inject(ToastService);

  // Khởi tạo Signal
  pageData = signal<Features | null>(null);
  relatedProducts = signal<Product[]>([]);

  constructor() {
    // BẮT BUỘC lấy dữ liệu Navigation ở constructor
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { features: Features };
    
    if (state && state.features) {
      this.pageData.set(state.features);
    }
  }

  ngOnInit(): void {
    // Nếu có dữ liệu thì mới gọi API
    if (this.pageData()) {
      this.getProductByFeature();
    } else {
      // Trường hợp người dùng F5 trang, state sẽ mất
      this.toast.error("Data lost. Please navigate from home page.");
      // Bạn có thể redirect về home hoặc xử lý lấy lại data từ URL title ở đây
    }
  }

  getProductByFeature() {
    const currentFeature = this.pageData();
    if (currentFeature) {
      this.productService.getProductsByFeature(currentFeature.label).subscribe({
        next: (res) => {
          this.relatedProducts.set(res);
        },
        error: (err) => {
          this.toast.error("Error loading products");
          console.error(err);
        }
      });
    }
  }
}