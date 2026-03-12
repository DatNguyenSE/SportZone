import { Component, inject, OnDestroy, OnInit, signal, ChangeDetectorRef } from '@angular/core';
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
  imports: [FormsModule, RouterLink, RouterLinkActive, CommonModule, UserDrawer],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {

  protected accountService = inject(AccountService);
  protected productService = inject(ProductService);
  protected busyService = inject(BusyService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  protected creds: any = {
    step: 1,
    email: '',
    password: '',
    otpCode: '',
    emailError: false
  };

  protected isLoginModalOpen = false;
  protected isPasswordVisible = false;
  protected isSubmitting = false;

  ngOnInit(): void { }

  toggleLoginModal() {
    this.isLoginModalOpen = !this.isLoginModalOpen;
    if (!this.isLoginModalOpen) {
      this.creds.step = 1;
      this.creds.email = '';
      this.creds.password = '';
      this.creds.otpCode = '';
      this.creds.emailError = false;
    }
  }

  onContinue() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(this.creds.email)) {
      this.creds.emailError = false;
      this.creds.step = 2;
    } else {
      this.creds.emailError = true;
    }
  }

  onLogin() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.cdr.detectChanges(); 

    if (!this.creds.fullname && this.creds.email) {
      this.creds.fullname = this.creds.email.split('@')[0];
    }

    this.accountService.authenticate(this.creds).subscribe({
      next: (res) => {
        if (res.requireOtp) {
          this.toast.success(res.message);
          

          setTimeout(() => {
            this.creds.step = 3;
            this.isSubmitting = false;
            this.cdr.detectChanges(); 
          }, 2000);

        } else {
          this.isSubmitting = false;
          this.toast.success(res.message);
          this.toggleLoginModal();
          if (res.user?.roles.includes('Admin')) {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/');
          }
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.log('error from interceptor:', error);

        if (error.status === 400 && error.error?.requireOtp) {
          this.toast.info(error.error.message); 
          
          // TRƯỜNG HỢP TÀI KHOẢN CŨ CHƯA XÁC THỰC CŨNG ĐỢI 3 GIÂY
          setTimeout(() => {
            this.creds.step = 3;
            this.isSubmitting = false;
            this.cdr.detectChanges();
          }, 2000);

        } else {
          this.isSubmitting = false;
         
          this.cdr.detectChanges();
        }
      }
    });
  }

  onVerifyOtp() {
    if (!this.creds.otpCode || this.creds.otpCode.length < 6) {
      this.toast.error("Vui lòng nhập đủ mã xác thực.");
      return;
    }

    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.cdr.detectChanges();

    const payload = {
      email: this.creds.email,
      otpCode: this.creds.otpCode
    };

    this.accountService.verifyEmail(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.toast.success(res.message);
        this.toggleLoginModal();

        if (res.user?.roles.includes('Admin')) {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error(err.error?.message || err.error || "Mã OTP không hợp lệ hoặc đã hết hạn.");
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigate([]);
  }

  togglePassword() { this.isPasswordVisible = !this.isPasswordVisible; }
  handleSelectUserItem() { const elem = document.activeElement as HTMLDivElement; if (elem) elem.blur(); }
  onCart() { this.router.navigate(['/cart']); }
  onAssist() { alert(`Vui lòng liên hệ email: datnt05se@gmail.com để được hỗ trợ`); }

  allProducts = this.productService.products;
  filteredProducts = signal<Product[]>([]);
  protected isSearching = false;

  constructor() { this.filteredProducts.set(this.allProducts()); }

  onSearch(value: string) {
    const query = value.toLowerCase().trim();
    if (!query) {
      this.isSearching = false;
      this.filteredProducts.set([]);
      return;
    }
    this.isSearching = true;
    const result = this.allProducts().filter(product =>
      product.name.toLowerCase().includes(query)
    ).slice(0, 6); 
    this.filteredProducts.set(result);
  }

  goToProduct(productId: number | string) {
    this.isSearching = false;
    this.router.navigate(['/product-detail', productId]);
  }
}