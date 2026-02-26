import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { CategoryService } from '../../../core/services/category-service'; // Import Service của bạn
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService); // Inject thêm service category

  private readonly SHOES_SLUG = 'shoes';
  private readonly SUB_SHOES_IDS = [1, 2, 3];

  private readonly JERSEY_SLUD = 'jersey';
  private readonly SUB_JERSEY_IDS = [4, 5];

  private readonly ACCESSORY_SLUD = 'accessory';
  private readonly SUB_ACCESSORY_IDS = [8];

  private readonly NEW_SLUD = 'new';
  private readonly SUB_NEW_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

  private readonly SALE_SLUG = 'sale';
  private readonly SUB_SALE_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

  isLoading = signal<boolean>(false);

  // Lấy ID từ URL
  routeParam = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id'))), // Lấy chuỗi raw
    { initialValue: null }
  );


  products = signal<Product[]>([]);
  private allMergedProducts = signal<any[]>([]);
  subCategories = signal<Category[]>([]);
  activeFilterId = signal<number>(0);

  categoryName = signal<string>('');


  constructor() {
    effect(() => {
      const param = this.routeParam();
      if (!param) return;

      // Reset state
      this.products.set([]);
      this.allMergedProducts.set([]);
      this.subCategories.set([]);
      this.activeFilterId.set(0);

      if (param === this.SHOES_SLUG) {
        this.categoryName.set('GIÀY BÓNG ĐÁ');
        this.loadMergedData(this.SUB_SHOES_IDS); // Không truyền gì = 'none'
      }
      else if (param === this.JERSEY_SLUD) {
        this.categoryName.set('ÁO BÓNG ĐÁ');
        this.loadMergedData(this.SUB_JERSEY_IDS);
      }
      else if (param === this.ACCESSORY_SLUD) {
        this.categoryName.set('Phụ Kiện');
        this.loadMergedData(this.SUB_ACCESSORY_IDS);
      }
      else if (param === this.NEW_SLUD) {
        this.categoryName.set('Hàng Mới');
        //  TRUYỀN CHẾ ĐỘ 'new'
        this.loadMergedData(this.SUB_NEW_IDS, 'new');
      }
      //  THÊM ĐIỀU KIỆN CHO SALE TẠI ĐÂY
      else if (param === this.SALE_SLUG) {
        this.categoryName.set('Khuyến Mãi');
        this.loadMergedData(this.SUB_SALE_IDS, 'sale');
      }
      else {
        const id = Number(param);
        if (!isNaN(id) && id > 0) {
          this.categoryService.getCategoryById(id).subscribe(cate => this.categoryName.set(cate.categoryName));
          this.productService.getProductsByCategoryId(id).subscribe(data => this.products.set(data));
        }
      }
    }, { allowSignalWrites: true });
  }


  // --- LOGIC XỬ LÝ GỘP ---

  // Đổi tham số thành filterMode
  async loadMergedData(ids: number[], filterMode: 'none' | 'new' | 'sale' = 'none') {
    try {
      this.isLoading.set(true);

      const categoryRequests = ids.map(id => this.categoryService.getCategoryById(id));
      const productRequests = ids.map(id => this.productService.getProductsByCategoryId(id));

      const [categories, productsLists] = await lastValueFrom(
        forkJoin([
          forkJoin(categoryRequests),
          forkJoin(productRequests)
        ])
      );

      this.subCategories.set(categories);

      let merged: any[] = [];
      productsLists.forEach((list, index) => {
        if (list && list.length > 0) {

          let filteredList = list;

          // XỬ LÝ LỌC THEO FILTER MODE TẠI ĐÂY
          if (filterMode === 'new') {
            // Lọc hàng mới
            filteredList = filteredList.filter((item: Product) => item.isNew === true);
          } else if (filterMode === 'sale') {
            // Lọc hàng giảm giá (Giả sử model Product của bạn có trường discount > 0)
            filteredList = filteredList.filter((item: Product) => item.discount && item.discount > 0);
          }

          const categoryIdOfThisList = ids[index];
          const mappedList = filteredList.map((item: Product) => ({
            ...item,
            localCategoryId: categoryIdOfThisList
          }));
          merged = merged.concat(mappedList);
        }
      });

      this.allMergedProducts.set(merged);
      this.products.set(merged);

    } catch (error) {
      console.error('Lỗi tải dữ liệu gộp:', error);
    } finally {
      this.isLoading.set(false);
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

  //RETURN TO PREVIOUS ACTION
  private location = inject(Location);
  goBack(): void {
    this.location.back(); // Quay lại hành động/trang trước đó trong lịch sử trình duyệt
  }

  // 1. Thêm Signal lưu trạng thái bộ lọc đang chọn
  selectedSort = signal<string>('newest');

  // 2. Hàm bắt sự kiện khi người dùng đổi select box
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSort.set(selectElement.value);
  }

  // 3. Tạo một Computed Signal để render ra HTML
  sortedProducts = computed(() => {
    // Tạo một bản sao của mảng để không làm biến đổi (mutate) mảng gốc
    const currentProducts = [...this.products()];
    const sortType = this.selectedSort();

    // Hàm tính giá thực tế sau khi trừ % discount
    const getFinalPrice = (p: Product) => p.price * (1 - (p.discount ?? 0) / 100);

    switch (sortType) {
      case 'priceAsc':
        // Giá tăng dần
        return currentProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
      case 'priceDesc':
        // Giá giảm dần
        return currentProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
      case 'mostSale':
        // Sale nhiều nhất (% discount cao nhất xếp trước)
        return currentProducts.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
      case 'oldest':
        // Cũ nhất (ID nhỏ xếp trước)
        return currentProducts.sort((a, b) => a.id - b.id);
      case 'newest':
      default:
        // Mới nhất (ID lớn xếp trước - Mặc định)
        return currentProducts.sort((a, b) => b.id - a.id);
    }
  });

  //  OBJECT QUẢN LÝ ẢNH 
  pageImages = {
    JERSEY_BANNER: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772103696/bong-da-san-co-sut-bong-banner_gxnozk.jpg',
    SHOES_BANNER: 'https://res.cloudinary.com/dmsx0pltj/image/upload/v1772102726/20240102_zZC5cwka_jfxtgt.jpg',
    DEFAULT_BANNER: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2000&auto=format&fit=crop'
  };
}