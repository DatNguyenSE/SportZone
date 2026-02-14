import { Component, computed, inject, OnInit, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
// Import đúng model và service của bạn
import { CategoryService } from '../../core/services/category-service';
import { ProductService } from '../../core/services/product-service';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../shared/models/order.model';

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
  templateUrl: './home.html', // Chú ý: Angular mới thường yêu cầu đường dẫn đúng hoặc inline
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  protected categoryService = inject(CategoryService);
  protected productService = inject(ProductService);
  protected orderService = inject(OrderService);
  private router = inject(Router);

  protected myOrder = signal<Order[] | null>(null);

  protected categories = this.categoryService.categories;
  protected products = this.productService.products;

  selectedCategoryId = signal<number>(0);

  private readonly FOOTBALL_SHOES_GROUP = [1, 2, 3];
  readonly FOOTBALL_CATEGORY_ID = 123;



  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats.length > 0 && this.selectedCategoryId() === 0) {
        this.selectedCategoryId.set(this.FOOTBALL_CATEGORY_ID);
      }
    }, { allowSignalWrites: true });
  }

  getOrderUser() {
    this.orderService.getUserOrders().subscribe({
      next: res => this.myOrder.set(res)
    })
  }

  pendingOrdersCount = computed(() =>
    this.myOrder()?.filter(o => o.status === 'Pending').length
  );

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.productService.getProducts();
    this.getOrderUser();
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

    // 1. Lọc bỏ 3 category lẻ (IC, FG, TF)
    const filtered = originalCats.filter(c => !this.FOOTBALL_SHOES_GROUP.includes(c.id));

    // 2. Thêm "Giày bóng đá" vào danh sách
    const footballGroup = { id: this.FOOTBALL_CATEGORY_ID, categoryName: 'Giày Bóng Đá', imageUrl: "👟" };

    return [footballGroup, ...filtered];
  });

  selectCategory(id: number) {
    this.selectedCategoryId.set(id);
  }


  onSeeMoreProducts() {
    this.router.navigate(['/category', this.selectedCategoryId()]);
  }



  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  slides: Slide[] = [
    {
      id: 1,
      // Ảnh cầu thủ buộc dây giày chuẩn bị vào sân (Rất "nghệ")
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2574&auto=format&fit=crop',
      title: 'PREDATOR ELITE',
      subtitle: 'Kiểm soát bóng, làm chủ cuộc chơi.',
      category: 'FIRM GROUND'
    },
    {
      id: 2,
      // Ảnh giày đinh trên sân cỏ (Cận cảnh)
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564&auto=format&fit=crop',
      title: 'X CRAZYFAST',
      subtitle: 'Tốc độ xé gió, bứt phá mọi giới hạn.',
      category: 'SPEED BOOTS'
    },
    {
      id: 3,
      // Ảnh sân vận động/cầu thủ đang sút (Action)
      image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=2670&auto=format&fit=crop',
      title: 'COPA PURE 2',
      subtitle: 'Cảm giác bóng chân thực nhất.',
      category: 'SÂN CỎ TỰ NHIÊN'
    },
    {
      id: 4,
      // Ảnh bóng đá đường phố / Futsal (Tối màu, ngầu)
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2549&auto=format&fit=crop',
      title: 'STREET LEGEND',
      subtitle: 'Thống trị mặt sân cỏ nhân tạo.',
      category: 'TURF / FUTSAL'
    }
  ];

  scroll(direction: 'left' | 'right') {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.clientWidth / (window.innerWidth > 768 ? 3 : 1); // Cuộn 1 slide

    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }
}