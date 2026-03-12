import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Order } from '../../../shared/models/order.model';
import { OrderService } from '../../../core/services/order-service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PaymentInput } from '../../../shared/models/payment.model';
import { AccountService } from '../../../core/services/account-service';
import { PaymentService } from '../../../core/services/payment-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  private orderService = inject(OrderService);
  private accountService = inject(AccountService)
  private paymentService = inject(PaymentService);

  private toast = inject(ToastService);
  private route = inject(ActivatedRoute)
  protected order = signal<Order | null> (null)

  orderId = toSignal(
    this.route.params.pipe(map(p => +p['orderId'] || 0)),
    { initialValue: 0 }
  );

  
  ngOnInit(): void {

    this.getOrder();
  }

  getOrder() {
    this.orderService.getOrderDetail(this.orderId()).subscribe({
      next: res => 
        this.order.set(res)
    })
  }

  handleCancel() {
    if(confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      console.log('Đang xử lý hủy đơn #', this.orderId());
    }
  }

  handlePayment(orderId: number) {
     // Tạo payload chuẩn
      const paymentPayload: PaymentInput = {
        orderId: orderId,
        description: `SportZone - Don hang #${orderId} - User ${this.accountService.currentUser()?.id}`
      };
  
      this.paymentService.processPayment(paymentPayload).subscribe({
        next: res => {
          if (res.url) {
            window.location.href = res.url;
          }
        },
        error: (err) => {
          this.toast.error("Hệ thống thanh toán đang gặp sự cố.");
          console.error("Payment Error:", err);
        }
      });
  }

}