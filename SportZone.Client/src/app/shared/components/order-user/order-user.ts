import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../models/order.model';
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
  
  protected userOrder = signal<Order[]>([]);
  private router = inject(Router)
  protected currentStatus = signal<string>('Pending');

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (response) => {
        this.userOrder.set(response);
      },
      error: (err) => {
        console.error('Lỗi gọi API:', err);
      }
    });
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