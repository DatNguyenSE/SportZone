import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserProfile } from '../../types/user';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  protected accountService = inject(AccountService);
  protected orderService = inject(OrderService); 
  private router = inject(Router);

  id = this.router.getCurrentNavigation()?.extras.state?.['orderData']?.id || null;
  couponCode = this.router.getCurrentNavigation()?.extras.state?.['couponCode'] || '';

  profile = signal<UserProfile | null>(null);

  protected orderDetail = signal<Order | null >(null);
  
  ngOnInit(): void {
    this.getProfile();
    this.getItemOrder();
  }

  getProfile() {
     this.accountService.getProfile().subscribe({
      next: (response) => {
        console.log('User Profile:', response);
        this.profile.set(response);
      },
      error: (err) => console.error('Lỗi gọi API:', err)   
    });
  }

  getItemOrder() {
    return this.orderService.getOrderDetail(this.id).subscribe({
      next: (response) => {
        this.orderDetail.set(response);
        console.log('Order Detail:', response);
      },
      error: (err) => console.error('Lỗi gọi API:', err)
    });
  }
}
