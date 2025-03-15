import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ProductRequest } from "../../models/product.model";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "app-add-product",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
  ],
  template: `
    <div class="header">
      <button class="back-button" (click)="navigateTo('product')">
        <i nz-icon nzType="arrow-left" nzTheme="outline"></i>
        Back to Products
      </button>
      <h2 class="form-title">Thêm sản phẩm</h2>
    </div>

    <div class="container">
      <form nz-form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label nzFor="name" nzRequired>Tên sản phẩm</nz-form-label>
          <nz-form-control>
            <input nz-input id="name" formControlName="name" type="text" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="description" nzRequired>Mô tả</nz-form-label>
          <nz-form-control>
            <textarea
              nz-input
              id="description"
              formControlName="description"
              rows="4"
            ></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="price" nzRequired>Giá</nz-form-label>
          <nz-form-control>
            <input nz-input id="price" formControlName="price" type="number" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzFor="quantity" nzRequired>Số lượng</nz-form-label>
          <nz-form-control>
            <input
              nz-input
              id="quantity"
              formControlName="quantity"
              type="number"
            />
          </nz-form-control>
        </nz-form-item>

        <div class="button-group">
          <button
            nz-button
            nzType="primary"
            [disabled]="productForm.invalid"
            class="save-button"
          >
            <i nz-icon nzType="save" nzTheme="outline"></i>
            Thêm
          </button>
          <button
            nz-button
            nzType="default"
            (click)="cancel()"
            class="cancel-button"
          >
            <i nz-icon nzType="close" nzTheme="outline"></i>
            Hủy
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .header {
        background: linear-gradient(135deg, #43cea2, #185a9d);
        color: white;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .back-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .back-button:hover {
        text-decoration: underline;
      }

      .form-title {
        font-size: 28px;
        color: #333;
        text-align: center;
        flex-grow: 1;
      }

      .container {
        width: 500px;
        margin: auto;
        padding: 30px;
        background: white;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        border-radius: 15px;
      }

      label {
        font-size: 17px;
        color: #555;
        font-weight: 600;
      }

      input[type="text"],
      input[type="number"],
      textarea {
        border: 1px solid #ced4da;
        border-radius: 10px;
        padding: 14px 18px;
        font-size: 16px;
        width: 100%; /* Đảm bảo full width */
        box-sizing: border-box;
        transition: border-color 0.3s ease;
        outline: none;
        height: 45px; /* Thiết lập chiều cao cố định */
      }

      textarea {
        height: 120px;
      }

      input:focus,
      textarea:focus {
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      nz-form-item {
        margin-bottom: 20px;
        display: grid; /* Sử dụng CSS Grid */
        grid-template-columns: 150px 1fr; /* Cột đầu tiên cho label, cột thứ hai cho input */
        align-items: center; /* Căn giữa theo chiều dọc */
        gap: 10px; /* Khoảng cách giữa các cột */
      }

      nz-form-label {
        text-align: left; /* Căn chỉnh label sang phải */
        padding-right: 10px; /* Thêm một chút khoảng cách với input */
      }

      .button-group {
        display: flex;
        justify-content: space-around;
        margin-top: 30px;
      }
      /* Style the add action*/
      .save-button {
        color: white;
        padding: 15px 30px; /* Kích thước lớn hơn */
        border: none;
        border-radius: 25px; /* Bo tròn hơn */
        cursor: pointer;
        transition: transform 0.2s ease;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background: linear-gradient(
          135deg,
          #43cea2,
          #185a9d
        ); /* Thêm gradient */
      }

      /* Set the change of hover*/
      .save-button:hover {
        background: linear-gradient(
          135deg,
          #185a9d,
          #43cea2
        ); /* Đảo ngược gradient khi hover */
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .cancel-button {
        color: white;
        padding: 15px 30px; /* Kích thước lớn hơn */
        border: none;
        border-radius: 25px; /* Bo tròn hơn */
        cursor: pointer;
        transition: transform 0.2s ease;
        font-size: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: #e53935;
      }

      /* Hover effect */
      .cancel-button:hover {
        background-color: #0d47a1; /* Darker shade on hover */
      }
    `,
  ],
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const newProduct: ProductRequest = this.productForm.value;
      this.productService.addProduct(newProduct).subscribe({
        next: (product) => {
          console.log("Sản phẩm đã thêm:", product);
          this.router.navigate(["/product"]);
        },
        error: (error) => {
          console.error("Lỗi khi thêm sản phẩm:", error);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(["/product"]);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
