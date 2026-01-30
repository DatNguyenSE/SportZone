import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../../core/services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators'; // 1. Import finalize
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-manager.html',
  styleUrl: './product-manager.css',
})
export class ProductManager implements OnInit {
  private productService = inject(ProductService);

  products = this.productService.products;

  newProduct: Product = this.getEmptyProduct();
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditing: boolean = false;
  private router = inject(Router);
  
  // 2. Biến trạng thái loading
  isLoading: boolean = false;

  getEmptyProduct(): Product {
    return {
      id: 0, name: '', description: '', brand: '',
      price: 0, categoryId: 1, quantity: 1, imageUrl: '', isDelete: false
    };
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts();
  }

  onEdit(product: Product) {
    this.isEditing = true;
    this.newProduct = { ...product };
    this.imagePreview = product.imageUrl || null;
    this.selectedFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancelEdit() {
    this.isEditing = false;
    this.resetForm();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.newProduct.name || this.newProduct.price <= 0) {
      alert('Tên và Giá là bắt buộc!');
      return;
    }

    // 3. Bật trạng thái loading
    this.isLoading = true;

    if (this.isEditing) {
      // --- UPDATE ---
      this.productService.updateProduct(this.newProduct.id, this.newProduct, this.selectedFile)
        .pipe(
          // 4. finalize chạy khi xong việc (kể cả lỗi) -> tắt loading
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            alert('Cập nhật thành công!');
            this.loadProducts();
            this.onCancelEdit();
            window.location.href = '/product-manager';
          },
          error: (err) => alert('Lỗi cập nhật: ' + err.message),
        });
    } else {
      // --- CREATE ---
      this.productService.addProduct(this.newProduct, this.selectedFile)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            alert('Thêm thành công!');
            this.loadProducts();
            this.resetForm();
            window.location.href = '/product-manager';
          },
          error: (err) => alert('Lỗi thêm mới: ' + err.message),
        });
    }
  }

  onDelete(id: number) {
    if (confirm('Xóa sản phẩm này?')) {
      // Delete thường nhanh nên có thể không cần loading, 
      // nhưng nếu muốn bạn cũng có thể thêm isLoading = true ở đây.
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => console.error(err),
      });
    }
  }

  resetForm() {
    this.newProduct = this.getEmptyProduct();
    this.selectedFile = null;
    this.imagePreview = null;
    this.isEditing = false;
  }
}