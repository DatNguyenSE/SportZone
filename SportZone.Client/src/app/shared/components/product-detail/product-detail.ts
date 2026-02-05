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
  product = signal<Product | null>(null);
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
        next: (res) => {
          this.product.set(res);
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
  isDescriptionOpen = signal(true);  // Mô tả sản phẩm mặc định mở


  selectSize(sizeLabel: string) {
    this.selectedSize.set(sizeLabel);
    this.quantity.set(1);
  }

  // Tự động tính toán số lượng tồn kho dựa trên size được chọn
  stockForSelectedSize = computed(() => {
    const product = this.product();
    const sizeName = this.selectedSize();

    if (!product || !sizeName) return 0;

    // Tìm size tương ứng trong mảng productSizes
    const sizeInfo = product.productSizes?.find(s => s.sizeName === sizeName);
    return sizeInfo ? sizeInfo.quantity : 0;
  });



  updateQuantity(amount: number) {
    const currentQty = this.quantity();

    const maxQty = this.stockForSelectedSize();
    const newQty = currentQty + amount;

    if (newQty < 1) return;

    if (maxQty === 0) {
      this.toast.error('Vui lòng chọn kích cỡ!');
      return;
    }
    if (newQty > maxQty) {
      this.toast.error(`Rất tiếc, size này chỉ còn ${maxQty} sản phẩm trong kho!`);
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
      quantity: this.quantity()
    });

    this.cartService.addToCart(this.product()!.id, this.quantity(), this.selectedSize()!).subscribe({
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