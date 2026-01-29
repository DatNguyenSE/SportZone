import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';


@Component({
  selector: 'app-account-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './account-profile.html',
  styleUrl: './account-profile.css',
})

export class AccountProfile implements OnInit {
  protected accountService = inject(AccountService)
  user: UserProfile | undefined;
  ngOnInit(): void {
    this.accountService.getProfile().subscribe({
      next: (response) => {
        console.log('API trả về:', response);
        // 3. Gán dữ liệu API trả về vào biến user
        this.user = response; 
      },
      error: (err) => {
        console.error('Lỗi gọi API:', err);
      }
    });
  }

  // Hàm giả lập lưu thay đổi
  onSave(): void {
    console.log('Dữ liệu đang lưu:', this.user);
    alert('Đã cập nhật hồ sơ thành công!');
  }

  onSelectAvatar(): void {
    alert('Chức năng upload ảnh sẽ được tích hợp sau');
  }
}
