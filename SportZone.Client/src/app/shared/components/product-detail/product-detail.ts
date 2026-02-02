import { Component, computed, effect, inject, Input, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductService } from '../../../core/services/product-service';
import { HasRole } from "../../directives/has-role";
import { ToastService } from '../../../core/services/toast-service';
import { CartService } from '../../../core/services/cart-service';

export interface ProductUI extends Product {
  reviewCount: number;
  isAdiClub: boolean;
  colors: Array<{ id: string; name: string; imageUrl: string }>;
  sizes: Array<{ label: string; available: boolean }>;
}

const MOCK_EXTRAS = {
  reviewCount: 24,
  isAdiClub: true,
  colors: [
    { id: 'White', name: 'Cloud White', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzFnAF9AUV2BJunHgex4bebta2JYAEAj4o_pwvTxdul6bFAuW6sGVTYW2COFFRA_jDTu7OtBmdm-zSkgJdJh3EqNRvdYNGWuNpWoU_OlFkYw0FX5tyI7aSNmY0hD-mm78awiR1JRnhkmzLqjl-FIiyCvcbjCMbL_Yot4aNwqs7_IHATIXGuVBN85ihbuz4A2knoNbr2gfWq60edpjWB2FfzzyA6n4R4yDw1XqK2BuM4O1jKLU8yXa7yCtBjqm_xXVVfzdu81vmE-oB' },

    { id: 'Black', name: 'Core Black', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc7KnzE29Z9xWyQIjWB1QtILPpPeS2VaHHeznH1z0Vv3io2vPRLlqdpQey4H1IlsBIlwPLiEpdfeLpBa7sRArWxa7BtlMBk-miFvBCDIyCexCWexqNiKo0iJsN4pRYaYmo7_RBoOkpzWbRlK9nqBNWvEa5MkXFL6syt2QINI8Y58VyhKConWsO23hsKOFl-un2uLQPYZqGkBuRnLx1SZ8izbjpgot8ilqPfWsQS5G1Pe8nscA7R0hbxOaUkrB6pJs2AUrdqnhzl7XF' }
  ],
  sizes: [
    { label: '6 UK', available: true },
    { label: '6.5 UK', available: true },
    { label: '7 UK', available: true },
    { label: '7.5 UK', available: true },
    { label: '8 UK', available: true },
    { label: '8.5 UK', available: true },
    { label: '9 UK', available: true },
    { label: '9.5 UK', available: false },
    { label: '10 UK', available: true },
  ]
};

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink, HasRole],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})

export class ProductDetail {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toast = inject(ToastService);
  product = signal<ProductUI | null>(null);
  productRefer = signal<Product[] | null>(null);

  productId = toSignal(
    this.route.params.pipe(map(p => +p['id'] || 0)),
    { initialValue: 0 }
  );

  constructor() {
    effect(() => {
      const id = this.productId();
      if (id === 0) return;

      this.productService.getProductsById(id).subscribe({
        next: (res: Product) => {
          const fullProduct: ProductUI = {
            ...res,          // Lấy toàn bộ dữ liệu thật (id, name, price...)
            ...MOCK_EXTRAS,   // Đắp thêm dữ liệu giả (colors, sizes...)
            // Nếu muốn ảnh từ API đè lên ảnh giả thì để res sau, 
            // còn muốn ảnh giả đè lên thì xử lý thủ công ở đây:
            imageUrl: res.imageUrl || MOCK_EXTRAS.colors[0].imageUrl
          };
          this.product.set(fullProduct);

          //call product by category to set ref
          this.productService.getProductsByCategoryId(this.product()?.categoryId).subscribe({
            next: res => this.productRefer.set(res)
          })
        },
        error: (err) => console.error(err)
      })
    })
  }



  // State quản lý bằng Signal
  quantity = signal(1);
  selectedSize = signal<string | null>(null);
  selectedColorId = signal<string>('White'); // Mặc định chọn màu đầu tiên
  isDescriptionOpen = signal(true);  // Mô tả sản phẩm mặc định mở


  // Computed value để lấy thông tin màu đang chọn
  currentColor = computed(() =>
    this.product()?.colors.find(c => c.id === this.selectedColorId())
  );

  // Methods
  selectSize(sizeLabel: string) {
    this.selectedSize.set(sizeLabel);
  }

  selectColor(colorId: string) {
    this.selectedColorId.set(colorId);
  }

  updateQuantity(amount: number) {
  const currentQty = this.quantity();
  const maxQty = this.product()?.quantity ?? 0;
  const newQty = currentQty + amount;

  if (newQty < 1) {
    return;
  }

  if (newQty > maxQty) {
    // Hiển thị thông báo lỗi
    this.toast.error(`Rất tiếc, chúng tôi chỉ còn ${maxQty} sản phẩm trong kho!`);
    return;
  }

  this.quantity.set(newQty);
}

  addToCart() {
    if (!this.selectedSize()) {
       this.toast.error('Vui lòng chọn kích cỡ!');
      return;
    }
    console.log('Added to cart:', {
      product: this.product()?.name,
      size: this.selectedSize(),
      color: this.selectedColorId(),
      quantity: this.quantity()
    });

    this.cartService.addToCart(this.product()!.id, this.quantity()).subscribe({
      next: () => {
        this.toast.success('Sản phẩm đã được thêm vào giỏ hàng!');
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
      }
    });

    
  }

  toggleFavorite() {
    console.log('Toggled favorite');
  }

  

  toggleDescription() {
    this.isDescriptionOpen.update(v => !v);
  }
}