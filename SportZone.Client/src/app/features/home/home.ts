import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Cần thiết để dùng *ngFor, *ngIf
import { CategoryService } from '../../core/services/category-service';
import { RouterModule } from '@angular/router';

// 1. Định nghĩa khuôn mẫu dữ liệu (Interface)
interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  categoryName: string;
  price: number;
  originalPrice?: number; // Dấu ? nghĩa là có thể không có
  imageUrl: string;
  isNew?: boolean;
  discountPercent?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  
  // 2. Khai báo biến để chứa dữ liệu
  featuredProducts: Product[] = [];
  categoryService = inject(CategoryService);
  categories = this.categoryService.categories;
  constructor() {}

  ngOnInit(): void {
   this.categoryService.getCategories();
   this.loadData();
  }

  loadData() {
    // --- GIẢ LẬP GỌI API (Sau này thay bằng HttpClient gọi xuống .NET) ---
    
  

    // Giả lập lấy sản phẩm nổi bật
    this.featuredProducts = [
      { 
        id: 1, 
        name: 'Áo Thun Chạy Bộ Cool-Dry', 
        categoryName: 'Running', 
        price: 350000, 
        originalPrice: 450000, 
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPYqUq2YDR-hFj3ft__2t62NVE1v-g8ZWSf2xNV6d1JFN8mtHKWqdElaOjykeZL_Riq7Z0fGoGci6IeGLx9arZvQKaD5iXZMtJME9sUTwhFsEuqIAc4Oo7b_ScaUmLoDBPq1kFsCuH7BTj44VA1eKyqSE_PMW5VasLCUpWsu8YZbe82At-jn3-ocCC4YRwAAMVyg6hBOEZDEku5ChzKQbZj8pu24ScrnAn3cWd9UHByMwHat3DnKgsN08dwWrhRKBTplr9eZJ9x-E',
        discountPercent: 20
      },
      { 
        id: 2, 
        name: 'Quần Legging Yoga Co Giãn', 
        categoryName: 'Yoga', 
        price: 450000, 
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdRWwx8N13c0husEcvpiMXfCRjj_4YOUXmUgUwRvV62e5wLPd4Dj6_YQeDB-i5plwJdOHWq_pGPnRJcbruWxn11OEAdgPX6GL8WXhF0QwYnX8M9z8dvp3SQULlYyUH3ZcUEKoD6atjy9HYdnFU-VtIoiAOf8TlV0rKfirVmDQfhLMnPpPRrU95rO6Mct5vonDqXXfEOSrijX7aky6gPUXRQ_SiAy4tdKi5OmUy4eSorlGu8D87u15y07IeYC4fOtCj_cvlfuYKiic',
        isNew: true
      },
      { 
        id: 3, 
        name: 'Áo Khoác Gió Thể Thao', 
        categoryName: 'Outdoor', 
        price: 600000, 
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY06L_n-hL1pBKPpZH5FcflO66F81gir_HUaXc6JqQ5qM78v__WowubA5B3c097nFqkPasaWcknEnmFf00qN2_waXWFcrwc1xLfsRCVv9GWTBshp6O093hu0nH2A_h2M4rrAMxuQ3CCIdE44uUax9KSDadvhPt80QczgegMm3d2qzQR1Xp8tWRb9j9jVcXR4TROEj5jo1l4bSqrIooFO-lc1Whn46YuiMgJWSz4D5VXfxZ-Sj8dqmABZMBgeCg01_nomJ6V1Kmq84'
      },
      { 
        id: 4, 
        name: 'Giày Chạy Bộ Speed Pro', 
        categoryName: 'Running', 
        price: 1250000, 
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGAFaQG0QSuooPUV8JNId2JNk4FAk0drttIelgzN45dyrkCEgkPCQLmjHoM2P_sXKYR2WysxQKytViJeSDtkvTiub853A2hdMLItL92tZ030HOK1XG5c53qNX8vBY77oo94kmjVwQ8jhAwkkSm4bJNU3JwLLeDia2nfOh_q0VbR_e1rtIkSwV8eSUqDp-Idhww2ic0ir25ec1JswV_5YKDRB7Up5pnCmKtZV3h-zMAVTUonJfeq54AubInhXpOWFyz1MDTlo2YiY0'
      }
    ];
  }
}