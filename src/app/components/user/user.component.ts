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
  ],
  template: `
    <div class="container">
      <header class="header">
        <div class="nav-buttons">
          <button nz-button nzType="primary" (click)="navigateTo('product')">
            Product
          </button>
          <button
            nz-button
            nzType="primary"
            (click)="navigateTo('order/admin')"
          >
            Order
          </button>
        </div>
        <h1 class="title">User Management</h1>
      </header>

      <main class="content">
        <div class="actions">
          <button nz-button nzType="default" nzGhost (click)="downloadPdf()">
            📄 Tải PDF
          </button>
          <button nz-button nzType="default" nzGhost (click)="downloadExcel()">
            📊 Tải Excel
          </button>
        </div>

        <nz-spin [nzSpinning]="isLoading">
          <nz-table
            #basicTable
            [nzData]="users"
            [nzBordered]="true"
            [nzSize]="'middle'"
            [nzPageSize]="5"
          >
            <thead>
              <tr>
                <th nzWidth="10%">ID</th>
                <th nzWidth="30%">Username</th>
                <th nzWidth="30%">Email</th>
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
        position: relative;
      }

      .nav-buttons {
        position: absolute;
        left: 20px;
        display: flex;
        gap: 10px;
      }

      .title {
        margin: 0;
        font-size: 24px;
        text-align: center;
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
      }

      .no-users {
        margin-top: 20px;
        font-size: 16px;
        color: #6b7280;
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
