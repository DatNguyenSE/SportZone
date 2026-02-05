import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { CartService } from '../../core/services/cart-service';
import { CartItem } from '../../types/cart';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';
import { PromotionService } from '../../core/services/promotion-service';
import { Promotion } from '../../shared/models/promotion.model';

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'], 
})
export class Cart implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private promotionService = inject(PromotionService);

  private updateQuantitySubject = new Subject<{ productId: number, quantity: number, sizeName: string }>();
  private updateSubscription!: Subscription;

  protected cartItems = signal<CartItem[]>([]);
  protected promotions = signal<Promotion[]>([]);

  // --- COMPUTED SIGNALS (Tự động tính toán khi cartItems thay đổi) ---
  totalItems = computed(() => 
    this.cartItems().length
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
    if (code) {
      console.log('Đang áp dụng mã:', code);
      // Gọi service để kiểm tra mã ở đây
    }
  }


// --- CẤU HÌNH DEBOUNCE ---
  setupDebounceUpdate() {
    this.updateSubscription = this.updateQuantitySubject.pipe(
      debounceTime(800), // ⏳ Chờ 800ms sau lần bấm cuối cùng mới chạy tiếp
      switchMap(data => {
        // Gọi API cập nhật
        console.log(`📡 Đang gọi API update cho SP ${data.productId} với SL ${data.quantity} và size ${data.sizeName}`);
        return this.cartService.updateCartItem(data.productId, data.quantity,data.sizeName) ;
      })
    ).subscribe({
      next: (res) => {
        console.log('✅ Cập nhật thành công trên server');
        // Nếu server trả về data giỏ hàng mới, bạn có thể set lại cartItems ở đây để đồng bộ
      },
      error: (err) => {
        console.error('❌ Lỗi cập nhật:', err);
        // ⚠️ QUAN TRỌNG: Nếu lỗi, phải hoàn tác (rollback) số lượng về cũ
        // Bạn có thể gọi lại getCartItems() để reset dữ liệu đúng từ server
        this.getCartItems(); 
        alert('Có lỗi xảy ra khi cập nhật số lượng!');
      }
    });
  }

  // --- HÀM UPDATE QUANTITY ---
  updateQuantity(item: CartItem, value: any) {
    let newQty = Number(value);
    if (!newQty || newQty < 1) newQty = 1;

    // 1. Cập nhật Giao Diện Ngay Lập Tức (Optimistic UI)
    // Giúp user cảm thấy app rất nhanh
    this.cartItems.update(items => 
      items.map(i => i.productId === item.productId ? { ...i, quantity: newQty } : i)
    );

    // 2. Đẩy yêu cầu vào "dòng suối" để chờ xử lý (Debounce)
    this.updateQuantitySubject.next({ 
      productId: item.productId, 
      quantity: newQty,
      sizeName: item.productSize.sizeName
    });
  }

  // Xóa sản phẩm
  removeItem(productId: number, sizeName: string) {
  
    this.cartService.removeFromCart(productId, sizeName).subscribe({
      next: () => {
        console.log(`✅ Đã xóa SP ${productId} thành công trên server`);    
      },
      error: (err) => {
        console.error('❌ Lỗi xóa sản phẩm:', err);
        alert('Có lỗi xảy ra khi xóa sản phẩm!');
        return;
      }
    });
    
    this.cartItems.update(items => items.filter(i => i.productId !== productId));

    // Gọi API xóa (giả lập)
    // this.cartService.removeItem(productId).subscribe(...)
  }
}