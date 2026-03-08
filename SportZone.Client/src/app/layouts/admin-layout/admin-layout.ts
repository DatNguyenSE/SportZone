import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  public accountService = inject(AccountService);
  private router = inject(Router);
  
  isSidebarCollapsed = signal(false);

  menuItems = [
    { label: 'Thống kê', icon: 'dashboard', link: '/admin/dashboard' },
    { label: 'Sản phẩm', icon: 'inventory_2', link: '/admin/products' },
    { label: 'Hội viên', icon: 'group', link: '/admin/users' },
    { label: 'Banner', icon: 'view_carousel', link: '/admin/banners' },
  ];

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }
}