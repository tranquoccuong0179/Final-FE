import { Component, OnInit } from "@angular/core";
import { User } from "../../models/auth.model";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-left">
          <h1 class="greeting">
            Hello, {{ profile?.firstName }} {{ profile?.lastName }}
          </h1>
          <button class="product-btn" (click)="goToHome()">Products</button>
          <button class="product-btn" (click)="goToOrder()">Orders</button>
        </div>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </header>

      <main class="content">
        <div class="card">
          <h2 class="card-title">Your Profile</h2>
          <div class="card-body">
            <div class="profile-detail">
              <label>Username:</label>
              <p>{{ profile?.username }}</p>
            </div>
            <div class="profile-detail">
              <label>Email:</label>
              <p>{{ profile?.email }}</p>
            </div>
            <div class="profile-detail">
              <label>First Name:</label>
              <p>{{ profile?.firstName }}</p>
            </div>
            <div class="profile-detail">
              <label>Last Name:</label>
              <p>{{ profile?.lastName }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f3f4f6;
        font-family: "Arial", sans-serif;
      }

      .header {
        background-color: #4f46e5;
        color: #fff;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .greeting {
        margin: 0;
        font-size: 24px;
      }

      .product-btn {
        background-color: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logout-btn {
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .logout-btn:hover {
        background-color: #dc2626;
      }

      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 20px;
      }

      .card {
        background: white;
        width: 100%;
        max-width: 400px;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .card-title {
        font-size: 22px;
        font-weight: bold;
        color: #374151;
        margin-bottom: 20px;
      }

      .card-body {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .profile-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 10px;
      }

      .profile-detail label {
        font-weight: bold;
        color: #6b7280;
      }

      .profile-detail p {
        margin: 0;
        font-weight: 500;
        color: #374151;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  profile?: User | null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.loadProfileFromAPI();
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error("Lỗi khi lấy thông tin profile", err);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
  goToHome() {
    this.router.navigate(["/product"]);
  }

  goToOrder() {
    this.router.navigate(["/order"]);
  }
}
