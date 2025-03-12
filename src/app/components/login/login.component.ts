import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="login-header">
        <h2>Đăng Nhập</h2>
        <p>Chào mừng bạn quay lại!</p>
      </div>
      <form (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label for="username">Tên đăng nhập</label>
          <div class="input-group">
            <i class="icon-user"></i>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <div class="input-group">
            <i class="icon-lock"></i>
            <input
              [type]="showPassword ? 'text' : 'password'"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Nhập mật khẩu"
              required
            />
            <button
              type="button"
              class="toggle-password"
              (click)="togglePassword()"
            >
              {{ showPassword ? "Ẩn" : "Hiển thị" }}
            </button>
          </div>
        </div>
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <button type="submit" class="submit-btn">Đăng Nhập</button>
      </form>
      <p class="auth-link">
        Chưa có tài khoản? <a routerLink="/register">Đăng ký</a>
      </p>
    </div>
  `,
  styles: [
    `
      .auth-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        background: white;
      }
      .login-header {
        text-align: center;
        margin-bottom: 30px;
      }
      .login-header h2 {
        color: #2c3e50;
        margin-bottom: 10px;
      }
      .login-header p {
        color: #7f8c8d;
        margin: 0;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .input-group {
        display: flex;
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow: hidden;
        transition: border-color 0.3s;
      }
      .input-group:focus-within {
        border-color: #3498db;
      }
      .icon-user,
      .icon-lock {
        padding: 12px;
        background: #f5f5f5;
        color: #7f8c8d;
      }
      .toggle-password {
        background: none;
        border: none;
        padding: 12px;
        cursor: pointer;
        font-size: 14px;
        color: #3498db;
      }
      input {
        flex: 1;
        padding: 12px;
        border: none;
        font-size: 14px;
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
      .error-message {
        color: red;
        font-size: 14px;
        text-align: center;
      }
    `,
  ],
})
export class LoginComponent {
  username = "";
  password = "";
  showPassword = false;
  errorMessage = "";

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.username && this.password) {
      this.authService
        .login({
          username: this.username,
          password: this.password,
        })
        .subscribe({
          next: () => {
            // this.router.navigate(["/home"]);
          },
          error: (error) => {
            console.error("Login failed:", error);
            this.errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
          },
        });
    }
  }
}
