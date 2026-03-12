import { Component, computed, inject, OnInit, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { CategoryService } from '../../../core/services/category-service';
import { ProductService } from '../../../core/services/product-service';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../shared/models/order.model';
import { Product } from '../../../shared/models/product.model';
import { Features } from '../../../shared/models/features.model';
import { FeatureService } from '../../../core/services/feature-service';
import { AccountService } from '../../../core/services/account-service';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  protected categoryService = inject(CategoryService);
  protected productService = inject(ProductService);
  protected orderService = inject(OrderService);
  protected featureService = inject(FeatureService);
  protected accoutSerivce = inject(AccountService);
  private router = inject(Router);

  protected categories = this.categoryService.categories;
  protected products = this.productService.products;
  protected featuresBanner = this.featureService.featuresBanner;
  protected myOrder = this.orderService.myOrder;

  selectedCategoryId = signal<number>(0);

  private readonly FOOTBALL_SHOES_GROUP = [1, 2, 3];
  readonly FOOTBALL_CATEGORY_ID = 123;
  private readonly FOOTBALL_SLUG = 'shoes';

  //  OBJECT QUẢN LÝ ẢNH 
  pageImages = {
    heroBanner: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772092241/vn_ipoj4c.webp',
    gloryTrophy: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2670&auto=format&fit=crop',
    passionStadium: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=2831&auto=format&fit=crop',
    teamHuddle: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2000&auto=format&fit=crop'
  };

  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats.length > 0 && this.selectedCategoryId() === 0) {
        this.selectedCategoryId.set(4);
      }
    }, { allowSignalWrites: true });
  }


  pendingOrdersCount = computed(() =>
    this.myOrder().filter(o => o.status === 'Pending' || o.status === 'Placed').length
  );

  ngOnInit(): void {
    this.featureService.getBannerFeatures();
    this.categoryService.getCategories();
    this.productService.getProducts();
    if(this.accoutSerivce.currentUser() !== null) {
      this.orderService.getUserOrders();
    }
    this.pendingOrdersCount()
  }

  filteredProducts = computed(() => {
    const currentId = this.selectedCategoryId();
    const allProducts = this.products();

    if (!allProducts) return [];
    if (currentId === 0) return allProducts;
    if (currentId === this.FOOTBALL_CATEGORY_ID) {
      return allProducts.filter(p => this.FOOTBALL_SHOES_GROUP.includes(p.categoryId));
    }
    return allProducts.filter(p => p.categoryId === currentId);
  });

  displayCategories = computed(() => {
    const originalCats = this.categories();
    const ALLOWED_IDS = [4, 6];
    const CATEGORY_ICONS: Record<number, string> = {
      4: '🏃‍♂️',
      6: '⚽'
    };

    const filtered = originalCats
      .filter(c => ALLOWED_IDS.includes(c.id))
      .map(c => {
        const icon = CATEGORY_ICONS[c.id] ? `${CATEGORY_ICONS[c.id]} ` : '';
        return {
          ...c,
          categoryName: `${c.categoryName} ${icon}`
        };
      });

    const footballGroup = {
      id: this.FOOTBALL_CATEGORY_ID,
      categoryName: 'Giày Bóng Đá 👟',
      imageUrl: "👟"
    };

    return [...filtered, footballGroup];
  });

  selectCategory(id: number) {
    this.selectedCategoryId.set(id);
  }

  onSeeMoreProducts() {
    const currentId = this.selectedCategoryId();
    if (currentId === this.FOOTBALL_CATEGORY_ID) {
      this.router.navigate(['/category', this.FOOTBALL_SLUG]);
    } else {
      this.router.navigate(['/category', currentId]);
    }
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  slides: Slide[] = [
    {
      id: 1,
      image: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772119951/bong_thi_dau_chinh_thuc_cho_mua_giai_moi__5__76c74ffb117b4694a64685e4d487f034_u8yjqn.jpg',
      title: 'PREDATOR ELITE',
      subtitle: 'Kiểm soát bóng, làm chủ cuộc chơi.',
      category: 'FIRM GROUND'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564&auto=format&fit=crop',
      title: 'X CRAZYFAST',
      subtitle: 'Tốc độ xé gió, bứt phá mọi giới hạn.',
      category: 'SPEED BOOTS'
    },

    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2549&auto=format&fit=crop',
      title: 'STREET LEGEND',
      subtitle: 'Thống trị mặt sân cỏ nhân tạo.',
      category: 'TURF / FUTSAL'
    }
  ];


  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.clientWidth / (window.innerWidth > 768 ? 3 : 1);
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }
}