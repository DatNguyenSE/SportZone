import { Component, inject, OnInit } from '@angular/core';
import { Product, ProductSize } from '../../models/product.model'; // Đảm bảo interface khớp DTO
import { ProductService } from '../../../core/services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category-service';

@Component({
  selector: 'app-product-manager',
  standalone: true, // Thêm nếu bạn dùng Angular 15+
  imports: [CommonModule, FormsModule],
  templateUrl: './product-manager.html',
  styleUrl: './product-manager.css',
})
export class ProductManager implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  products = this.productService.products;
  categories = this.categoryService.categories;

  // Khởi tạo object khớp với cấu trúc DTO mới
  newProduct: any = this.getEmptyProduct();
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditing: boolean = false;
  isLoading: boolean = false;

  getEmptyProduct() {
    return {
      id: 0,
      name: '',
      description: '',
      brand: '',
      price: 0,
      categoryId: 1,
      discount: 0,
      isNew: true,
      label: null,
      productSizes: [] as ProductSize[] 
    };
  }

  ngOnInit(): void {
    this.loadProducts();
    this.categoryService.getCategories();
  }

  loadProducts() {
    this.productService.getProducts();
  }

  // --- LOGIC QUẢN LÝ SIZE ---
  addSize() {
    if (!this.newProduct.productSizes) {
      this.newProduct.productSizes = [];
    }
    this.newProduct.productSizes.push({ sizeName: '', quantity: 0 });
  }

  removeSize(index: number) {
    this.newProduct.productSizes.splice(index, 1);
  }

  // Tính tổng số lượng để hiển thị (tùy chọn)
  getTotalQuantity(product: any): number {
    if (!product.productSizes) return 0;
    return product.productSizes.reduce((acc: number, curr: any) => acc + curr.quantity, 0);
  }

  onEdit(product: any) {
    this.isEditing = true;
    // Deep copy để tránh tham chiếu trực tiếp làm hỏng dữ liệu trong danh sách khi đang sửa
    this.newProduct = JSON.parse(JSON.stringify(product)); 
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
  // 1. Kiểm tra các trường cơ bản
  if (!this.newProduct.name || this.newProduct.price <= 0) {
    alert('Vui lòng nhập đầy đủ Tên và Giá sản phẩm!');
    return;
  }

  // 2. Kiểm tra Thể loại (Trường hợp placeholder null)
  if (!this.newProduct.categoryId) {
    alert('Vui lòng chọn Thể loại sản phẩm!');
    return;
  }

  // 3. Kiểm tra Ảnh (Chỉ bắt buộc khi thêm mới, cập nhật có thể giữ ảnh cũ)
  if (!this.isEditing && !this.selectedFile) {
    alert('Vui lòng chọn hình ảnh cho sản phẩm mới!');
    return;
  }

  // 4. Kiểm tra danh sách Size (Tùy chọn nhưng nên có)
  if (!this.newProduct.productSizes || this.newProduct.productSizes.length === 0) {
    if(!confirm('Sản phẩm chưa có kích thước/số lượng. Bạn vẫn muốn tạo?')) return;
  }

  this.isLoading = true;

  if (this.isEditing) {
    // Logic Update...
    this.productService.updateProduct(this.newProduct.id, this.newProduct, this.selectedFile)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          alert('Cập nhật thành công!');
          this.loadProducts();
          this.onCancelEdit();
        },
        error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
      });
  } else {
    // Logic Create...
    this.productService.addProduct(this.newProduct, this.selectedFile)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          alert('Thêm thành công!');
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => alert('Lỗi: ' + (err.error?.message || err.message))
      });
  }
}
  onDelete(id: number) {
    if (confirm('Xóa sản phẩm này?')) {
      this.isLoading = true;
      this.productService.deleteProduct(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => this.loadProducts(),
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