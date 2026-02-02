import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Cần cho *ngFor, *ngIf, CurrencyPipe
import { FormsModule } from '@angular/forms';   // Cần cho ngModel (select box)
import { CartService } from '../../core/services/cart-service';
import { CartItem } from '../../types/cart';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true, // Angular 17+ mặc định là standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'], // Lưu ý: styleUrl -> styleUrls (hoặc styleUrl tùy version CLI, nhưng styleUrls an toàn hơn)
})
export class Cart implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private updateQuantitySubject = new Subject<{ productId: number, quantity: number }>();
  private updateSubscription!: Subscription;

  protected cartItems = signal<CartItem[]>([]);

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


  // SEED DỮ LIỆU BANNER TẠI ĐÂY

  protected promoBanner = signal<PromoBanner>({
    isVisible: true,
    title: 'Tặng quà Tết 🧧 Giới hạn thời gian',
    description: 'Miễn phí vận chuyển cho đơn hàng trên 2.000.000₫.',
    icon: 'redeem', // Tên icon lấy từ Material Icons
    type: 'holiday',
    couponCode: 'YYSS2024' // Mã giảm giá
  });

  ngOnInit() {
    this.getCartItems();
    this.setupDebounceUpdate();
  }
  
  ngOnDestroy() {
    // Hủy đăng ký khi component bị đóng để tránh rò rỉ bộ nhớ
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

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

// --- CẤU HÌNH DEBOUNCE ---
  setupDebounceUpdate() {
    this.updateSubscription = this.updateQuantitySubject.pipe(
      debounceTime(800), // ⏳ Chờ 800ms sau lần bấm cuối cùng mới chạy tiếp
      switchMap(data => {
        // Gọi API cập nhật
        console.log(`📡 Đang gọi API update cho SP ${data.productId} với SL ${data.quantity}`);
        return this.cartService.updateCartItem(data.productId, data.quantity);
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
      quantity: newQty 
    });
  }

  // Xóa sản phẩm
  removeItem(productId: number) {
    // Cập nhật Optimistic UI
    this.cartItems.update(items => items.filter(i => i.productId !== productId));

    // Gọi API xóa (giả lập)
    // this.cartService.removeItem(productId).subscribe(...)
  }
}