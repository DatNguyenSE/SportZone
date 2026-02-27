import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './feature-detail.html',
  styleUrl: './feature-detail.css',
})
export class FeatureDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  // 1. Định nghĩa kho nội dung cho từng trang
  private readonly CONFIG: Record<string, any> = {

    'goalkeeper': {
      label: 'ELITE CATCH',
      title: 'PROFESSIONAL GRIP',
      desc: 'Công nghệ bám dính tuyệt đối trong mọi điều kiện thời tiết. Được tin dùng bởi các thủ môn hàng đầu.',
      image: 'https://images.unsplash.com/photo-1515003672233-85f0960549c4?q=80&w=2000&auto=format&fit=crop',
      categoryId: 7,
      themeColor: '#3b82f6',
      techSpecs: ['Micro-Texture Skin', '3D Precision Touch', 'Anti-Slip Control']
    },

    'ballcontrol': {
      label: 'Master the Ball',
      title: 'PRECISION GRIP',
      desc: 'Cảm giác bóng tuyệt đối với công nghệ phủ Micro-texture. Giúp trái bóng luôn "dính chân" trong mọi nhịp chạm và bứt tốc.',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000',
      categoryId: 2,
      themeColor: '#3b82f6',
      techSpecs: ['Micro-Texture Skin', '3D Precision Touch', 'Anti-Slip Control']
    },
    'teamwear': {
      label: 'Kits & Jerseys',
      title: 'OFFICIAL TEAMWEAR',
      desc: 'Sát cánh cùng đam mê với những bộ trang phục thi đấu chính hãng.',
      image: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772091873/0a379d9f6d490c7ac35c80ac2ab70344_e0zevp.jpg',
      categoryId: 4, // ID của Áo
      themeColor: '#ef4444' // Red
    },
    'ball': {
      label: 'Official Match Ball',
      title: 'AERODYNAMICS',
      desc: 'Cấu trúc 12 bảng nhiệt luyện với rãnh khí động học AeroSCULPT, đảm bảo quỹ đạo bay ổn định và chính xác đến từng milimet.',
      image: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772119951/bong_thi_dau_chinh_thuc_cho_mua_giai_moi__5__76c74ffb117b4694a64685e4d487f034_u8yjqn.jpg',
      categoryId: 6, // Giả sử ID danh mục Bóng là 6
      themeColor: '#eab308', // Màu vàng Gold (đại diện cho vinh quang/chuyên nghiệp)
      techSpecs: ['FIFA Quality Pro', 'AeroSCULPT Grooves', 'Textured Surface']
    },
  };

  // 2. Lấy slug từ URL (ví dụ: /features/ballcontrol)
  activeSlug = signal<string>(this.route.snapshot.paramMap.get('slug') || '');

  // 3. Computed để lấy dữ liệu trang hiện tại
  pageData = computed(() => this.CONFIG[this.activeSlug()] || this.CONFIG['ballcontrol']);

  // 4. Lọc sản phẩm liên quan
  relatedProducts = computed(() => {
    const catId = this.pageData().categoryId;
    return this.productService.products().filter(p => p.categoryId === catId).slice(0, 8);
  });
}