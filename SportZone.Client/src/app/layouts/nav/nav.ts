import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { BusyService } from '../../core/services/busy-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product-service';
import { Product } from '../../shared/models/product.model';
import { UserDrawer } from "../user-layout/user-drawer/user-drawer";


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterLinkActive, CommonModule, UserDrawer],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

 
  protected accountService = inject(AccountService);
  protected productService = inject(ProductService);
  protected busyService = inject(BusyService);
  private router = inject(Router);
  private toast = inject(ToastService);

  protected creds: any = {
    step: 1,
    email: '',
    password: '',
    emailError: false
  };
  protected isLoginModalOpen = false;
  protected isPasswordVisible = false;
  private isSubmitting = false;


  ngOnInit(): void {
   
    
  }
 
  toggleLoginModal() {
    this.isLoginModalOpen = !this.isLoginModalOpen;
    // Reset lại trạng thái khi đóng mở
    if (!this.isLoginModalOpen) {
      this.creds.step = 1;
      this.creds.email = '';
      this.creds.password = '';
      this.creds.emailError = false;
    }
  }

  onContinue() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailPattern.test(this.creds.email)) {
      this.creds.emailError = false;
      this.creds.step = 2; // Chuyển sang bước nhập Password
    } else {
      this.creds.emailError = true; // Hiển thị lỗi
    }
  }

  onLogin() {
    if (this.isSubmitting) return;
     if (!this.creds.fullname && this.creds.email) {
      this.creds.fullname = this.creds.email.split('@')[0];
    }

    this.accountService.authenticate(this.creds).subscribe({
      next: (res) => {
        
        this.toast.success(res.message);
        this.toggleLoginModal(); 
        if (res.user.roles.includes('Admin')) {
          this.router.navigateByUrl('/admin');
        }
       else {
        this.router.navigateByUrl('/'); 
      }
      },
      error: (error) => {
        console.log('error from interceptor:', error);
      
      }
    })
  }

  logout() {
    this.accountService.logout();
    this.router.navigate([]);
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
   
  handleSelectUserItem() {
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }


  onCart() {
    this.router.navigate(['/cart']);
  }

  onAssist() {
    alert(`Vui lòng liên hệ email: datnt05se@gmail.com để được hỗ trợ`);
  }

  allProducts = this.productService.products;
  filteredProducts = signal<Product[]>([]);

  constructor() {
    // Ban đầu hiển thị tất cả
    this.filteredProducts.set(this.allProducts());
  }

  protected isSearching = false;

// Thay vì set trong constructor, ta dùng effect hoặc logic trực tiếp trong onSearch
onSearch(value: string) {
  const query = value.toLowerCase().trim();
  
  if (!query) {
    this.isSearching = false;
    this.filteredProducts.set([]);
    return;
  }

  this.isSearching = true;

  // Lọc sản phẩm: tìm trong tên hoặc mô tả
  const result = this.allProducts().filter(product => 
    product.name.toLowerCase().includes(query)
  ).slice(0, 6); // Giới hạn 6 kết quả cho đẹp giao diện

  this.filteredProducts.set(result);
}

// Hàm điều hướng khi click vào sản phẩm
goToProduct(productId: number | string) {
  this.isSearching = false;
  
  this.router.navigate(['/product-detail', productId]); // Giả sử route của bạn là /product/:id
}
}
