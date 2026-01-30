import { Component, computed, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
// Import đúng model và service của bạn
import { CategoryService } from '../../core/services/category-service';
import { ProductService } from '../../core/services/product-service';

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
  private router = inject(Router);

  protected categories = this.categoryService.categories;
  protected products = this.productService.products;

  selectedCategoryId = signal<number>(0);

  private readonly FOOTBALL_SHOES_GROUP = [1, 2, 3];
  readonly FOOTBALL_CATEGORY_ID = 999;



  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats.length > 0 && this.selectedCategoryId() === 0) {
        this.selectedCategoryId.set(this.FOOTBALL_CATEGORY_ID);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
    this.productService.getProducts();
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

}