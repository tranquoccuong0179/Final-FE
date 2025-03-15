import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Users } from "../../models/auth.model";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzMessageModule, NzMessageService } from "ng-zorro-antd/message";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzIconModule } from "ng-zorro-antd/icon";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzMessageModule,
    NzSpinModule,
    NzIconModule,
  ],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-left">
          <div class="title">User Management</div>
        </div>

        <div class="header-right">
          <button class="nav-btn" (click)="navigateTo('product')">
            <i nz-icon nzType="inbox" nzTheme="outline"></i> Product
          </button>
          <button class="nav-btn" (click)="navigateTo('order/admin')">
            <i nz-icon nzType="reconciliation" nzTheme="outline"></i> Order
          </button>
        </div>
      </header>

      <main class="content">
        <div class="actions">
          <button class="btn-action" nz-button (click)="downloadPdf()">
            📄 Tải PDF
          </button>
          <button class="btn-action" nz-button (click)="downloadExcel()">
            📊 Tải Excel
          </button>
        </div>

        <nz-spin [nzSpinning]="isLoading">
          <div class="table-wrapper">
            <nz-table
              #basicTable
              [nzData]="users"
              [nzBordered]="true"
              [nzSize]="'middle'"
              [nzShowPagination]="false"
              class="custom-table"
            >
              <thead>
                <tr>
                  <th nzWidth="10%">ID</th>
                  <th nzWidth="35%">Username</th>
                  <th nzWidth="35%">Email</th>
                  <th nzWidth="20%">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <button
                      class="btn-delete"
                      nz-button
                      nzType="primary"
                      nzDanger
                      (click)="confirmDelete(user.id)"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </nz-spin>

        <p *ngIf="users.length === 0 && !isLoading" class="no-users">
          No users found.
        </p>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f4f7f9;
        font-family: "Roboto", sans-serif;
      }

      .header {
        background: linear-gradient(
          135deg,
          #43cea2,
          #185a9d
        ); /* Gradient mạnh mẽ */
        color: #fff;
        padding: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        width: 100%;
        box-sizing: border-box;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        margin-bottom: 20px; /* Thêm margin-bottom */
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .nav-btn {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 22px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .nav-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .title {
        margin: 0;
        font-size: 24px;
        text-align: left;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        justify-content: center;
      }

      .no-users {
        margin-top: 20px;
        font-size: 16px;
        color: #6b7280;
      }

      .btn-action {
        background: linear-gradient(135deg, #43cea2, #185a9d);
        color: white;
        padding: 14px 26px; /* Larger padding */
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 18px; /* Larger font size */
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        min-width: 150px; /* Minimum width for buttons */
      }

      .btn-action:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .btn-delete {
        background: linear-gradient(135deg, #ff5e62, #ff9966);
        color: white;
        padding: 12px 22px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        min-width: 120px;
      }

      .btn-delete:hover {
        transform: translateY(-2px);
      }

      /* Table Styles */
      .table-wrapper {
        width: 100%;
        max-width: 1400px;
      }

      .custom-table {
        width: 100%;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        font-size: 1.1rem;
      }

      .custom-table thead th {
        background-color: #546e7a;
        color: white;
        font-weight: 600;
        padding: 16px 20px;
        text-align: left;
        border-bottom: 3px solid #455a64;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .custom-table tbody td {
        padding: 16px 20px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }

      .custom-table tbody tr:nth-child(even) {
        background-color: #f2f6ff;
      }

      .custom-table tbody tr:hover {
        background-color: #bbdefb;
        transition: background-color 0.3s ease;
      }

      .custom-table th:first-child,
      .custom-table td:first-child {
        padding-left: 25px;
      }

      .custom-table th:last-child,
      .custom-table td:last-child {
        padding-right: 25px;
        text-align: center;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  users: Users[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private route: Router,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (response: { code: number; data: Users[] }) => {
        this.users = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.message.error("Không thể tải danh sách người dùng!");
        this.isLoading = false;
      },
    });
  }

  confirmDelete(userId: number) {
    this.modal.confirm({
      nzTitle: "Bạn có chắc chắn muốn xóa người dùng này?",
      nzContent: "Hành động này không thể hoàn tác!",
      nzOkText: "Xóa",
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => this.deleteUser(userId),
      nzCancelText: "Hủy",
    });
  }

  deleteUser(userId: number) {
    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.message.success("Xóa người dùng thành công!");
      },
      error: () => {
        this.message.error("Lỗi khi xóa người dùng!");
      },
    });
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
