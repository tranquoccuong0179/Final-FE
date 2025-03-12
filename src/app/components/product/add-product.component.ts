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

@Component({
  selector: "app-add-product",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Thêm sản phẩm</h2>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Tên sản phẩm</label>
          <input id="name" formControlName="name" type="text" required />
        </div>

        <div class="form-group">
          <label for="description">Mô tả</label>
          <textarea
            id="description"
            formControlName="description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="price">Giá</label>
          <input id="price" formControlName="price" type="number" required />
        </div>

        <div class="form-group">
          <label for="quantity">Số lượng</label>
          <input
            id="quantity"
            formControlName="quantity"
            type="number"
            required
          />
        </div>

        <div class="form-group">
          <button type="submit" [disabled]="productForm.invalid">Thêm</button>
          <button type="button" (click)="cancel()">Hủy</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        width: 400px;
        margin: auto;
        padding: 20px;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
      }
      input,
      textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      button {
        margin-right: 10px;
        padding: 10px;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      button[type="submit"] {
        background-color: #4caf50;
        color: white;
      }
      button[type="submit"]:disabled {
        background-color: #ccc;
      }
      button[type="button"] {
        background-color: #f44336;
        color: white;
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
}
