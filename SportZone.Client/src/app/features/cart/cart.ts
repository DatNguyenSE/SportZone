import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart-service';
import { CartItem } from '../../types/cart';
import { debounceTime, of, Subject, Subscription, switchMap } from 'rxjs';
import { PromotionService } from '../../core/services/promotion-service';
import { Promotion } from '../../shared/models/promotion.model';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { OrderService } from '../../core/services/order-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private promotionService = inject(PromotionService);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private router = inject(Router);


  private updateQuantitySubject = new Subject<{ productId: number, quantity: number, sizeName: string }>();
  private updateSubscription!: Subscription;

  protected cartItems = signal<CartItem[]>([]);
  protected promotions = signal<Promotion[]>([]);

  // --- COMPUTED SIGNALS (Tự động tính toán khi cartItems thay đổi) ---
  totalItems = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0
    )
  );

  // 2. Tổng tiền hàng trước thuế và phí vận chuyển
  subTotal = computed(() =>
    this.cartItems().reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0)
  );

  // 3. Thuế (Giả sử 8% trên subTotal - discount)
  taxRate = 0.03; // 3% thuế VAT
  discount = signal<number>(0); // Bạn có thể biến cái này thành signal nếu có mã giảm giá

  taxAmount = computed(() => {
    const amount = (this.subTotal() - this.discount()) * this.taxRate;
    return amount > 0 ? amount : 0;
  });

  // 4. Tổng thanh toán cuối cùng
  shippingFee = 0; // Miễn phí
  finalTotal = computed(() =>
    this.subTotal() + this.shippingFee - this.discount() + this.taxAmount()
  );


  getCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (res) => {
        // Kiểm tra an toàn null/undefined
        this.cartItems.set(res.items || []);
      },
      error: (err) => {
        console.error('Lỗi khi lấy giỏ hàng:', err);
      }
    });
  }

  getPromotions() {
    this.promotionService.getPromotions().subscribe({
      next: (promos) => {
        console.log('Khuyến mãi hiện có:', promos);
        this.promotions.set(promos);
      },
      error: (err) => {
        console.error('Lỗi khi lấy khuyến mãi:', err);
      }
    });
  }


  ngOnInit() {
    this.getCartItems();
    this.getPromotions();
    this.setupDebounceUpdate();
  }

  ngOnDestroy() {
    // Hủy đăng ký khi component bị đóng để tránh rò rỉ bộ nhớ
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }


  // 1. Quản lý trạng thái đóng/mở danh sách khuyến mãi
  showAllPromotions = signal<boolean>(false);

  // 2. Lấy cái đầu tiên (Featured)
  firstPromotion = computed(() => {
    const apps = this.promotions().filter(p => p.isVisible);
    return apps.length > 0 ? apps[0] : null;
  });

  // 3. Lấy danh sách còn lại (từ phần tử thứ 2 trở đi)
  remainingPromotions = computed(() => {
    const apps = this.promotions().filter(p => p.isVisible);
    return apps.slice(1);
  });

  // Hàm toggle trạng thái
  togglePromotions() {
    this.showAllPromotions.update(val => !val);
  }


  // Lưu trữ mã giảm giá người dùng nhập
  couponCodeInput = signal<string>('');
  applyCoupon() {
    const code = this.couponCodeInput().trim();
    const finalTotal = this.finalTotal();
    if (code) {
      console.log('Đang áp dụng mã:', code);
      this.promotionService.validateCoupon(code, finalTotal).subscribe({
        next: (res) => {
          console.log(`Mã hợp lệ! Giảm ${res} VND`);
          console.log(`Order value is ${finalTotal} VND`);
          if (res === null || res <= 0) {
            this.toast.error('Mã giảm giá không hợp lệ hoặc không áp dụng được.');
            this.discount.set(0);
            return;
          }
          this.discount.set(res || 0);

        },
        error: (err) => {
          console.error('Mã không hợp lệ hoặc lỗi:', err);
          alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        }
      });
    }


  }


  // --- CẤU HÌNH DEBOUNCE ---
  setupDebounceUpdate() {
    this.updateSubscription = this.updateQuantitySubject.pipe(
      debounceTime(800),
      switchMap(data => {
        // Gọi API cập nhật
        console.log(`update cho SP ${data.productId} với SL ${data.quantity} và size ${data.sizeName}`);
        return this.cartService.updateCartItem(data.productId, data.quantity, data.sizeName);
      })
    ).subscribe({
      next: (res) => {
        console.log(' Cập nhật thành công trên server');
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        this.getCartItems();
        alert('Có lỗi xảy ra khi cập nhật số lượng!');
      }
    });
  }

  // --- HÀM UPDATE QUANTITY ---
  updateQuantity(item: CartItem, value: any) {
    let newQty = Number(value);
    if (!newQty || newQty < 1) newQty = 1;

    this.cartItems.update(items =>
      items.map(i => i.productId === item.productId ? { ...i, quantity: newQty } : i)
    );

    // 2. Đẩy yêu cầu vào "dòng suối" để chờ xử lý (Debounce)
    this.updateQuantitySubject.next({
      productId: item.productId,
      quantity: newQty,
      sizeName: item.sizeName
    });
  }

  // Xóa sản phẩm
  removeItem(productId: number, sizeName: string) {

    this.cartService.removeFromCart(productId, sizeName).subscribe({
      next: () => {
        this.toast.info(` Đã xóa SP ${productId} thành công trên server`)
        console.log(` Đã xóa SP ${productId} thành công trên server`);
      },
      error: (err) => {
        console.error(' Lỗi xóa sản phẩm:', err);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
        return;
      }
    });

    this.cartItems.update(items => items.filter(i => i.productId !== productId));


  }


  onContinueInfoOrder() {
    if (this.cartItems().length === 0) {
      this.toast.error("Giỏ hàng hiện đang trống.");
      return;
    }

    const code = this.couponCodeInput().trim();
    const currentFinalTotal = this.finalTotal();

    const couponCheck$ = code
      ? this.promotionService.validateCoupon(code, currentFinalTotal)
      : of(0); // Nếu không có mã, trả về 0 ngay lập tức

    couponCheck$.subscribe({
      next: (res) => {
        let finalDiscount = 0;

        if (code) {
          if (res && res > 0) {
            finalDiscount = res;
            this.discount.set(res);
            this.toast.success(`Đã áp dụng mã giảm giá: ${res.toLocaleString()} VND`);
          } else {
            this.toast.warning("Mã giảm giá không hợp lệ và sẽ không được áp dụng.");
            this.discount.set(0);
          }
        }


        this.navigateToProcess(code, finalDiscount);
      },
      error: err => {
        console.error('Lỗi kiểm tra mã:', err);
        this.toast.error("Mã không hợp lệ hoặc đã hết hạn.");
        this.discount.set(0);
        //  chuyển trang nhưng không áp mã
        this.navigateToProcess('', 0);
      }
    });
  }

  private navigateToProcess(code: string, discountAmount: number) {
    this.router.navigate(['/order-detail/process'], {
      state: {
        discount: discountAmount,
        couponCode: code,
        taxAmount: this.taxAmount(),
        subTotal: this.subTotal(),
        finalTotal: this.finalTotal(), 
        totalItems: this.totalItems()
      }
    });
  }

}