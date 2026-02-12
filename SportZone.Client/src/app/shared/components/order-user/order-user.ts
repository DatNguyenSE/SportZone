import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-user',
  imports: [CommonModule],
  templateUrl: './order-user.html',
  styleUrl: './order-user.css',
})
export class OrderUser implements OnInit {
  protected orderService = inject(OrderService);
  protected userOrder = signal<Order[]>([]);

  ngOnInit(): void {
    this.getOrders();
  }

 getOrders() {
    return this.orderService.getUserOrders().subscribe({
      next: (response) => {
        console.log('User Orders:', response);
        this.userOrder.set(response);
      },
      error: (err) => {
        console.error('Lỗi gọi API:', err);
        return [];
      }
    });
  }
}
