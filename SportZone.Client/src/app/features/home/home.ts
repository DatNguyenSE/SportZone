import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Cần thiết để dùng *ngFor, *ngIf

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
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  
  // 2. Khai báo biến để chứa dữ liệu
  categories: Category[] = [];
  featuredProducts: Product[] = [];

  constructor() {}

  ngOnInit(): void {
    // Khi component chạy, gọi hàm lấy dữ liệu
    this.loadData();
  }

  loadData() {
    // --- GIẢ LẬP GỌI API (Sau này thay bằng HttpClient gọi xuống .NET) ---
    
    // Giả lập lấy danh mục
    this.categories = [
      { id: 1, name: 'Chạy bộ', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD37eLkuTee9jxr5-BFeW0_luMZgpfPOd-HqudQogvdqqt-yN4Hpn6_oYNFYDWLCAsejo92FtSbOFbQqUtYWzJQe7SnbHx2UV0QnWjZj0hWHq5GfCQ-I-F-ctoEhByfI1p5DPlnpH817CzOXOYzTHi5eyNVR-W84dKio_qr7N59KXe-TWpYUAiUSuUz6M0sMFyDQx4ZpG5QTZ6zMTMmpbmpTkE403YF8S47aOvj6GyuIxYmSZBDmY6WFTdV88LHBCGzHiDix6r6N5U' },
      { id: 2, name: 'Gym & Training', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT9PZFY-Hq1B6DrKEAM8SY_cc37HYfMSQlYQhWDYW8qd7sVpQrtAYIoOksohLzigeUolm6meBlMw4kqVXf02QEmURREBXud7-ZZgbpgcGU1KGmJJafaw944TUXtje7GGOXYFuQRIpoPdaNjsKa0xFVNgLc2_F1gcTXPhW4KcehuvV3gSy5sRUSFbYxpC2XESbOdvZCH25ErRnsWja1UmG4VlIT1hIejFzT6Vizd-j1gSSTuMicTXnbuA_tevYtn_L98PoKiSTq2gQ' },
      { id: 3, name: 'Bóng đá', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD53zpLexTd7z8ohz6oU3fv-B5FLA_BG5lxSfDAP8mYqRxA2siEbu9bNS7maCcWbgsc3DOCiYg3bljOyiDz0FM_oHMwg8YpgmYwReZOWtyX_yBLRezxyFIb1B-mGL8eX4rBFCytOnL_0GkYrwTWw3xZ65ynQO7ZjNfeBbqYnGe4an5sSO2Sc36O71rFxIFWdSXvfCt9fKDyq47-ZoA0nnqeuy4Nz3MoQ3ct6YBLU7lCr6mmRqzbZAmsa7AZVvjCessisy_UjNABrfk' },
      { id: 4, name: 'Yoga', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZP-eHP6_xsBSeWgTzzXzvCr3_aDxYHPZl_EBeQ7qpKiIQBkbMFVL64EEOpZPUnXksttbtYtpS0G4OJHTSa9ejPfXWbTrQGqkK8lnBTAGAJLEJMnqEv7iwVY63b3Xktbbl48Z67q1OqZj469mmShO0NNuPuZU1vr63aBSX7Td9roUNNTCPho3GncVK086QBcNNwDU4iBKytthQQodDaLLeJudQwJo4SM4V64M6t17pUjuV_VTkpfOaxnxCP9FTMguurn9pBOABujw' },
      { id: 5, name: 'Bóng rổ', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPXvj43kFpdMNVhOW1Q15oec2Z310zBcmIHNjSRGupQ3mcctqgQ2Ho0UR6tjsnwpdnJn_LTkF7lawRy3fr5XpPQUeAGw38AH35XqI4MF86lv3IE6y42fGw9HKUaVedlXobfRiMqBqnWYXa83cteDeGSx_R7Wp3OBNni5Is_3VBtDFEtip5yKsjPm1aREtGMy3acwwDOKGGZbysNdSEvv9HATTvoe87BfnjJgHWoisthDsKZpEY0qNcXmqZ8lEvNIdRKIiweNNYIHQ' },
      { id: 6, name: 'Quần vợt', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO5h-rwn2IQKLkAwvFHyTmhAPZ22NF_5YQAdWVWqYJoQXnxep9MdwbcuwABCyPXADx9KfDCEUHB0SFsYOOwD_UXTLs_r0Z7Os-unWlkarvnONE3N0qSWrterwXwaTfZatHOwQcNqV3bU5wNGSUi21BpSqHkxmiLIVC9yIj54PTKWMbxtJBSboOoDI6NdrTHrRzZyQuJvrcMTuKCyvLh2CHU-Cd-R8yUxgxsqn3k-kkpjDhza52glvFrGBf8wEcWe8hg4RFjAcJ9VQ' },
    ];

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