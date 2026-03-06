import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { Order } from '../../shared/models/order.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-user',
  standalone: true, 
  imports: [CommonModule, RouterLink],
  templateUrl: './order-user.html',
  styleUrl: './order-user.css',
})
export class OrderUser implements OnInit {
  private orderService = inject(OrderService);
  
  protected userOrder = this.orderService.myOrder; 
  private router = inject(Router)
  protected currentStatus = signal<string>('Pending');

  ngOnInit(): void {
    if (!this.userOrder() || this.userOrder().length === 0) {
      this.orderService.getUserOrders();
    }
  }

  
  filteredOrders = computed(() => {
    const status = this.currentStatus(); 
    const orders = this.userOrder();     

    if (status === 'Tất cả') {
      return orders;
    }
    
    return orders.filter(o => o.status === status);
  });

  setStatus(status: string) {
    this.currentStatus.set(status);
  }
}