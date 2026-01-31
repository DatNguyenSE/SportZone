import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service'; // Import Service của bạn
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.moedel';
import { Product } from '../../models/product.model';

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

  private readonly allShoesIds = 123;
  private readonly SUB_IDS = [1, 2, 3];
  isLoading = signal<boolean>(false);

  // Lấy ID từ URL
  categoryId = toSignal(
    this.route.params.pipe(map(p => +p['id'] || 0)),
    { initialValue: 0 }
  );


  products = signal<Product[]>([]);
  private allMergedProducts = signal<any[]>([]);
  subCategories = signal<Category[]>([]);
  activeFilterId = signal<number>(0);

  categoryName = signal<string>('');


  constructor() {
    effect(() => {
      const id = this.categoryId();
      if (id === 0) return;

      this.products.set([]);
      this.allMergedProducts.set([]);
      this.subCategories.set([]); 
      this.activeFilterId.set(0); 

      if (id === this.allShoesIds) {
        this.categoryName.set('GIÀY BÓNG ĐÁ');
        this.loadFootballData(); 
      } else {
        // Logic danh mục thường (không đổi)
        this.categoryService.getCategoryById(id).subscribe({
          next: (cate) => this.categoryName.set(cate.categoryName),
          error: () => this.categoryName.set('DANH MỤC')
        });
        
        this.productService.getProductsByCategoryId(id).subscribe({
          next: (data) => this.products.set(data),
          error: (err) => console.error(err)
        });
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {}

  // --- LOGIC XỬ LÝ GỘP ---
  async loadFootballData() {
    try {
     
      const categoryRequests = this.SUB_IDS.map(id => 
        this.categoryService.getCategoryById(id)
      );
      
      const productRequests = this.SUB_IDS.map(id => 
        this.productService.getProductsByCategoryId(id)
      );

      const [categories, productsLists] = await lastValueFrom(
        forkJoin([
            forkJoin(categoryRequests), // return [Category, Category, Category]
            forkJoin(productRequests)   // return [Product[], Product[], Product[]]
        ])
      );

      // Xử lý Danh mục con (Filter)
      this.subCategories.set(categories);

      let merged: any[] = [];
      productsLists.forEach((list, index) => {
        if (list && list.length > 0) {
            const categoryIdOfThisList = this.SUB_IDS[index];
            const mappedList = list.map(item => ({...item, localCategoryId: categoryIdOfThisList}));
            merged = merged.concat(mappedList);
        }
      });

      // Lưu vào state gốc và state hiển thị
      this.allMergedProducts.set(merged);
      this.products.set(merged);

    } catch (error) {
      console.error('Lỗi tải dữ liệu bóng đá:', error);
    }
  }

  // --- HÀM LỌC (Gắn vào nút bấm html) ---
  filterBySubCategory(subId: number) {
    this.activeFilterId.set(subId);

    // Nếu id = 0 thì hiện tất cả (lấy từ kho gốc)
    if (subId === 0) {
      this.products.set(this.allMergedProducts());
    } else {
      // Lọc từ kho gốc theo ID hoặc localCategoryId ta đã gắn ở trên
      const filtered = this.allMergedProducts().filter(p => 
        (p.categoryId === subId) || (p.localCategoryId === subId)
      );
      this.products.set(filtered);
    }
  }
}