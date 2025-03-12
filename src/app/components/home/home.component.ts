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
          <div class="avatar">
            <span>{{ getInitials(profile) }}</span>
          </div>
          <div>
            <h1 class="greeting">
              Hello, {{ profile?.firstName }} {{ profile?.lastName }}
            </h1>
            <p class="subtitle">Welcome back! 🎉</p>
          </div>
        </div>
        <div class="header-right">
          <button class="nav-btn" (click)="goToHome()">🛒 View Products</button>
          <button class="nav-btn" (click)="goToOrder()">📦 View Orders</button>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="content">
        <div class="card">
          <h2 class="card-title">Your Profile</h2>
          <div class="profile-body">
            <div class="profile-item">
              <label>Username:</label>
              <p>{{ profile?.username }}</p>
            </div>
            <div class="profile-item">
              <label>Email:</label>
              <p>{{ profile?.email }}</p>
            </div>
            <div class="profile-item">
              <label>First Name:</label>
              <p>{{ profile?.firstName }}</p>
            </div>
            <div class="profile-item">
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
      * {
        box-sizing: border-box;
      }

      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f8fafc;
        font-family: "Arial", sans-serif;
      }

      .header {
        background-color: rgb(147, 142, 235);
        color: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .avatar {
        width: 50px;
        height: 50px;
        background-color: #1e3a8a;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        border-radius: 50%;
        text-transform: uppercase;
      }

      .greeting {
        font-size: 18px;
        margin: 0;
      }

      .subtitle {
        font-size: 14px;
        color: #d1d5db;
        margin: 0;
      }
      .nav-btn {
        background-color: #6366f1;
        color: white;
        padding: 8px 14px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 14px;
      }

      .nav-btn:hover {
        background-color: #4338ca;
      }

      .logout-btn {
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .logout-btn:hover {
        background-color: #dc2626;
        transform: scale(1.05);
      }

      .content {
        display: flex;
        flex-direction: column;
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
        text-align: center;
        margin-bottom: 20px;
      }

      .profile-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .profile-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f3f4f6;
        border-radius: 6px;
      }

      .profile-item label {
        font-weight: bold;
        color: #374151;
      }

      .profile-item p {
        margin: 0;
        font-weight: 500;
        color: #1f2937;
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

  getInitials(user: User | null | undefined): string {
    if (!user) return "U";
    const initials = `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`;
    return initials.toUpperCase();
  }
}
