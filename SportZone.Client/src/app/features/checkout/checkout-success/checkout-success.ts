import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  
  // Giả lập mã đơn hàng lấy từ URL hoặc State
  orderId = signal<string>('');

  ngOnInit(): void {
    // Lấy orderId từ query params (ví dụ: /checkout/success?orderId=SPZ12345)
    this.route.queryParams.subscribe(params => {
      this.orderId.set(params['orderId'] || 'SZ' + Math.floor(Math.random() * 1000000));
    });
  }
}