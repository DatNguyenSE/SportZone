import { Component, computed, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  protected categories = this.categoryService.categories; 
  protected products = this.productService.products; 

  selectedCategoryId = signal<number>(0);

  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats.length > 0 && this.selectedCategoryId() === 0) {
        this.selectedCategoryId.set(cats[0].id);
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

    return allProducts.filter(p => p.categoryId === currentId);
  });

  selectCategory(id: number) {
    this.selectedCategoryId.set(id);
  }
}