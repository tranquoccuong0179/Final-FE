import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <h2>Đăng ký tài khoản</h2>
      <form (ngSubmit)="onSubmit()" class="registration-form">
        <!-- Tên -->
        <div class="form-group">
          <label for="firstName">First name:</label>
          <input
            type="text"
            id="firstName"
            [(ngModel)]="formData.firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last name:</label>
          <input
            type="text"
            id="lastName"
            [(ngModel)]="formData.lastName"
            name="lastName"
            placeholder="Enter your last name"
            required
          />
        </div>

        <div class="form-group">
          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            [(ngModel)]="formData.username"
            name="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            [(ngModel)]="formData.email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            [(ngModel)]="formData.password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" class="submit-btn">Đăng ký</button>
      </form>

      <!-- Liên kết chuyển đến trang đăng nhập -->
      <p class="auth-link">
        Đã có tài khoản? <a routerLink="/login">Đăng nhập</a>
      </p>
    </div>
  `,
  styles: [
    `
      .auth-container {
        max-width: 600px;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
        background: #ffffff;
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 25px;
      }
      .registration-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
      }
      input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        transition: border-color 0.3s;
      }
      input:focus {
        border-color: #3498db;
        outline: none;
      }
      .submit-btn {
        background-color: #3498db;
        color: white;
        padding: 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
      }
      .submit-btn:hover {
        background-color: #2980b9;
      }
      .auth-link {
        text-align: center;
        margin-top: 20px;
        color: #7f8c8d;
      }
      .auth-link a {
        color: #3498db;
        text-decoration: none;
      }
      .auth-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  formData = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isFormValid()) {
      const formDataWithDate = { ...this.formData };
      this.authService.register(formDataWithDate).subscribe({
        next: () => {
          this.router.navigate(["/login"]);
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
        },
        error: (error) => {
          console.error("Đăng ký thất bại:", error);
          alert("Đăng ký thất bại. Vui lòng thử lại.");
        },
      });
    }
  }

  private isFormValid(): boolean {
    return Object.values(this.formData).every((value) => value.trim() !== "");
  }
}
