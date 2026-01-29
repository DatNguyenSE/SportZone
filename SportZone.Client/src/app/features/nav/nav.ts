import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../../types/theme';
import { BusyService } from '../../core/services/busy-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterLinkActive, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
 
  protected accountService = inject(AccountService);
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
  // protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  // protected themes = themes;

  ngOnInit(): void {
    // document.documentElement.setAttribute('data-theme', this.selectedTheme());
    
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
      },
      error: (error) => {
        console.log('Lỗi đã được bắt bởi Interceptor:', error);
      
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


  handleSelectTheme(theme: string) {
    // this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  handleSelectUserItem() {
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }


}
