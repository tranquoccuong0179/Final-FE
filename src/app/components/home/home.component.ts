import { Component, OnInit } from "@angular/core";
import { User } from "../../models/auth.model";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { NzIconModule } from "ng-zorro-antd/icon";
import { IconDefinition } from "@ant-design/icons-angular";
import {
  UserOutline,
  MailOutline,
  IdcardOutline,
  EditOutline,
  SaveOutline,
} from "@ant-design/icons-angular/icons"; // Thêm icon chỉnh sửa và lưu
import { FormsModule } from "@angular/forms";
import { animate, style, transition, trigger } from "@angular/animations";

const icons: IconDefinition[] = [
  UserOutline,
  MailOutline,
  IdcardOutline,
  EditOutline,
  SaveOutline,
];

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, NzIconModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-left">
          <div class="avatar">
            <span>{{ getInitials(profile) }}</span>
          </div>
          <div>
            <h1 class="greeting">
              Chào mừng trở lại, {{ profile?.firstName }}
              {{ profile?.lastName }}!
            </h1>
            <p class="subtitle">Hãy khám phá những điều mới mẻ! 🎉</p>
          </div>
        </div>
        <div class="header-right">
          <button class="nav-btn" (click)="goToHome()">
            <i nz-icon nzType="shopping-cart" nzTheme="outline"></i> Sản phẩm
          </button>
          <button class="nav-btn" (click)="goToOrder()">
            <i nz-icon nzType="inbox" nzTheme="outline"></i> Đơn hàng
          </button>
          <button class="logout-btn" (click)="logout()">
            <i nz-icon nzType="logout" nzTheme="outline"></i> Đăng xuất
          </button>
        </div>
      </header>

      <main class="profile-container">
        <div class="cards-wrapper">
          <div
            class="profile-card"
            [@cardAnimation]="isEditing ? 'editing' : 'normal'"
          >
            <div class="profile-header">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                alt="Ảnh đại diện"
                class="profile-avatar"
              />
              <h2 class="profile-name">
                {{ profile?.firstName }} {{ profile?.lastName }}
              </h2>
            </div>
            <div class="profile-body">
              <div class="profile-info">
                <div class="icon-circle">
                  <i nz-icon nzType="user" nzTheme="outline"></i>
                </div>
                <span>{{ profile?.firstName }} {{ profile?.lastName }}</span>
              </div>
              <div class="profile-info">
                <div class="icon-circle">
                  <i nz-icon nzType="idcard" nzTheme="outline"></i>
                </div>
                <span>{{ profile?.username }}</span>
              </div>
              <div class="profile-info">
                <div class="icon-circle">
                  <i nz-icon nzType="mail" nzTheme="outline"></i>
                </div>
                <span>{{ profile?.email }}</span>
              </div>
            </div>
          </div>

          <div class="details-card">
            <h3 class="details-title">Thông tin cá nhân</h3>

            <div class="form-group">
              <label class="form-label">Tên:</label>
              <input
                type="text"
                [(ngModel)]="profile!.firstName"
                class="form-control"
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Họ:</label>
              <input
                type="text"
                [(ngModel)]="profile!.lastName"
                class="form-control"
                placeholder="Nhập họ của bạn"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tên đầy đủ:</label>
              <input
                type="text"
                [value]="profile?.firstName + ' ' + profile?.lastName"
                class="form-control"
                disabled
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email:</label>
              <input
                type="email"
                [(ngModel)]="profile!.email"
                class="form-control"
                placeholder="Nhập email của bạn"
                disabled
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tên đăng nhập:</label>
              <input
                type="text"
                [value]="profile!.username"
                class="form-control"
                disabled
              />
            </div>

            <div class="button-group">
              <button
                class="edit-button"
                (click)="toggleEdit()"
                *ngIf="!isEditing"
              >
                <i nz-icon nzType="edit" nzTheme="outline"></i> Chỉnh sửa
              </button>
              <button class="save-button" *ngIf="isEditing">
                <i nz-icon nzType="save" nzTheme="outline"></i> Lưu
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer class="footer"></footer>
    </div>
  `,
  styles: [
    `
      /* General Styles */
      .container {
        font-family: "Roboto", sans-serif; /* Phông chữ hiện đại */
        background-color: #f4f7f9; /* Nền nhẹ nhàng */
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
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

      .avatar {
        width: 70px;
        height: 70px;
        background-color: #fff;
        color: #185a9d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        border-radius: 50%;
        text-transform: uppercase;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        transition: all 0.3s ease;
      }

      .avatar:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
      }

      .greeting {
        font-size: 28px;
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .subtitle {
        font-size: 18px;
        color: #d4e1f7;
        margin: 0;
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

      .logout-btn {
        background-color: #e53935;
        color: white;
        border: none;
        padding: 12px 22px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .logout-btn:hover {
        background-color: #d32f2f;
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      /* Profile Container */
      .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        max-width: 1200px;
        margin-top: 40px;
        flex: 1;
      }

      .cards-wrapper {
        display: flex;
        width: 100%;
        gap: 40px;
        justify-content: center;
      }

      /* Profile Card */
      .profile-card {
        background-color: #fff;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        text-align: center;
        width: 35%;
        box-sizing: border-box;
        transition: transform 0.3s ease;
        overflow: hidden;
        position: relative; /* For animation */
      }

      .profile-card:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: linear-gradient(
          to right,
          #43cea2,
          #185a9d
        ); /* Highlight color */
      }

      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      }

      .profile-header {
        margin-bottom: 25px;
      }

      .profile-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 20px;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
      }

      .profile-name {
        font-size: 30px;
        margin-bottom: 20px;
        color: #333;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .profile-body {
        padding: 0 15px;
      }

      .profile-info {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 15px;
        color: #666;
        font-size: 16px;
      }

      .profile-info i {
        margin-right: 12px;
        font-size: 17px;
        color: #777;
      }

      .icon-circle {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #f2f2f2; /* Light grey background */
        position: relative; /* Add this */
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
      }

      /* Adjust icon size and display */
      .icon-circle i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
      }

      /* Details Card */
      .details-card {
        background-color: #fff;
        border-radius: 20px;
        padding: 30px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        width: 65%;
        box-sizing: border-box;
      }

      .details-title {
        font-size: 26px;
        margin-bottom: 25px;
        color: #333;
        border-bottom: 2px solid #eee;
        padding-bottom: 15px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .form-group {
        margin-bottom: 22px;
      }

      .form-label {
        display: block;
        font-size: 17px;
        color: #555;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .form-control {
        border: 1px solid #ced4da;
        border-radius: 10px;
        padding: 14px 18px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
        outline: none;
      }

      .form-control:focus {
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        margin-top: 30px;
      }

      .edit-button,
      .save-button {
        background-color: #2196f3;
        color: white;
        padding: 14px 24px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 17px;
        transition: background-color 0.3s ease, transform 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .edit-button:hover,
      .save-button:hover {
        background-color: #1976d2;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      /* Footer */
      .footer {
        text-align: center;
        padding: 25px;
        color: #777;
        border-top: 1px solid #eee;
        width: 100%;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
        }

        .header-left,
        .header-right {
          margin-bottom: 15px;
        }

        .cards-wrapper {
          flex-direction: column;
        }

        .profile-card,
        .details-card {
          width: 100%;
        }
        .form-group {
          margin-bottom: 20px;
        }
      }
    `,
  ],
  animations: [
    trigger("cardAnimation", [
      transition("normal => editing", [
        style({ transform: "scale(1)" }),
        animate("300ms ease-out", style({ transform: "scale(1.05)" })),
      ]),
      transition("editing => normal", [
        style({ transform: "scale(1.05)" }),
        animate("300ms ease-in", style({ transform: "scale(1)" })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  profile?: User | null = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  };

  isEditing: boolean = false; // Thêm trạng thái chỉnh sửa

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.loadProfileFromAPI();
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error("Lỗi khi tải thông tin người dùng", err);
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

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
