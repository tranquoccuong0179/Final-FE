import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User, Users } from "../../models/auth.model";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="nav-buttons">
          <button class="product-btn" (click)="navigateTo('product')">
            Product
          </button>
          <button class="product-btn" (click)="navigateTo('order/admin')">
            Order
          </button>
        </div>

        <h1 class="title">User Management</h1>
      </header>

      <main class="content">
        <div class="actions">
          <button class="download-btn" (click)="downloadPdf()">Tải PDF</button>
          <button class="download-btn" (click)="downloadExcel()">
            Tải Excel
          </button>
        </div>
        <table class="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="delete-btn" (click)="deleteUser(user.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="users.length === 0" class="no-users">No users found.</p>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f9fafb;
        font-family: "Arial", sans-serif;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1d4ed8;
        color: white;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
      }

      .nav-buttons {
        position: absolute;
        gap: 16px;
        left: 20px;
        display: flex;
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

      .product-btn:hover {
        background-color: #059669;
      }

      .title {
        margin: 0;
        font-size: 24px;
        flex-grow: 1;
        text-align: center;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .user-table {
        width: 100%;
        max-width: 800px;
        border-collapse: collapse;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .user-table th,
      .user-table td {
        padding: 12px 16px;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      .user-table th {
        background-color: #1d4ed8;
        color: white;
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 0.5px;
      }

      .user-table tr:last-child td {
        border-bottom: none;
      }

      .delete-btn {
        background-color: #ef4444;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .delete-btn:hover {
        background-color: #dc2626;
      }

      .no-users {
        margin-top: 20px;
        font-size: 16px;
        color: #6b7280;
      }

      .actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 15px;
      }

      .download-btn {
        background-color: #10b981; /* Màu xanh lá */
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }

      .download-btn:hover {
        background-color: #059669; /* Màu xanh đậm hơn khi hover */
        transform: scale(1.05);
      }

      .download-btn:active {
        background-color: #047857;
        transform: scale(0.95);
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  users: Users[] = [];

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (response: { code: number; data: Users[] }) => {
        this.users = response.data; // Trích xuất mảng `data` từ API
        console.log("Users loaded:", this.users);
      },
      error: (err) => {
        console.error("Error fetching users", err);
      },
    });
  }
  deleteUser(userId: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          console.log(`User with ID ${userId} deleted successfully.`);
          // Cập nhật danh sách người dùng sau khi xóa
          this.users = this.users.filter((user) => user.id !== userId);
        },
        error: (err) => {
          console.error(`Error deleting user with ID ${userId}`, err);
        },
      });
    }
  }
  downloadPdf(): void {
    this.authService.downloadPdf();
  }

  downloadExcel(): void {
    this.authService.downloadExcel();
  }

  navigateTo(route: string): void {
    this.route.navigate([`/${route}`]);
  }
}
