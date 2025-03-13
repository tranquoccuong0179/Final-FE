import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";

import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzNotificationService } from "ng-zorro-antd/notification";
import * as THREE from "three";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzTypographyModule,
    NzAlertModule,
  ],
  template: `
    <canvas #background></canvas>
    <div class="auth-container">
      <nz-card [nzBorderless]="true" class="register-card">
        <div class="register-header">
          <h2 nz-typography nzType="secondary">Đăng Ký</h2>
          <p nz-typography nzType="secondary">Tạo tài khoản mới!</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label for="firstName" nz-typography>First Name</label>
            <nz-input-group>
              <input
                type="text"
                nz-input
                id="firstName"
                [(ngModel)]="formData.firstName"
                name="firstName"
                placeholder="Nhập First Name"
                required
              />
            </nz-input-group>
          </div>

          <div class="form-group">
            <label for="lastName" nz-typography>Last Name</label>
            <nz-input-group>
              <input
                type="text"
                nz-input
                id="lastName"
                [(ngModel)]="formData.lastName"
                name="lastName"
                placeholder="Nhập Last Name"
                required
              />
            </nz-input-group>
          </div>

          <div class="form-group">
            <label for="username" nz-typography>Username</label>
            <nz-input-group [nzPrefix]="userIcon">
              <input
                type="text"
                nz-input
                id="username"
                [(ngModel)]="formData.username"
                name="username"
                placeholder="Nhập Username"
                required
              />
            </nz-input-group>
          </div>

          <div class="form-group">
            <label for="email" nz-typography>Email</label>
            <nz-input-group [nzPrefix]="emailIcon">
              <input
                type="email"
                nz-input
                id="email"
                [(ngModel)]="formData.email"
                name="email"
                placeholder="Nhập Email"
                required
              />
            </nz-input-group>
          </div>

          <div class="form-group">
            <label for="password" nz-typography>Password</label>
            <nz-input-group [nzPrefix]="lockIcon" [nzSuffix]="suffixTemplate">
              <input
                [type]="showPassword ? 'text' : 'password'"
                nz-input
                id="password"
                [(ngModel)]="formData.password"
                name="password"
                placeholder="Nhập Password"
                required
              />
            </nz-input-group>
          </div>

          <nz-alert
            *ngIf="errorMessage"
            nzType="error"
            [nzMessage]="errorMessage"
            class="mb-4"
          ></nz-alert>

          <button
            nz-button
            nzType="primary"
            nzBlock
            [nzLoading]="isLoading"
            type="submit"
          >
            Đăng Ký
          </button>
        </form>

        <nz-divider nzText="HOẶC"></nz-divider>

        <p class="auth-link">
          Đã có tài khoản?
          <a
            routerLink="/login"
            nz-typography
            nzType="secondary"
            class="link-text"
          >
            Đăng nhập
          </a>
        </p>
      </nz-card>
    </div>

    <ng-template #userIcon>
      <span nz-icon nzType="user" nzTheme="outline"></span>
    </ng-template>

    <ng-template #emailIcon>
      <span nz-icon nzType="mail" nzTheme="outline"></span>
    </ng-template>

    <ng-template #lockIcon>
      <span nz-icon nzType="lock" nzTheme="outline"></span>
    </ng-template>

    <ng-template #suffixTemplate>
      <span
        nz-icon
        [nzType]="showPassword ? 'eye' : 'eye-invisible'"
        nzTheme="outline"
        class="cursor-pointer"
        (click)="togglePassword()"
      ></span>
    </ng-template>
  `,
  styles: [
    `
      .auth-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 350px;
      }

      .register-card {
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.3);
      }

      .register-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .register-header h2 {
        margin-bottom: 8px;
        color: rgb(91, 173, 255);
        font-size: 24px;
        font-weight: 600;
      }

      .register-header p {
        color: #7f8c8d;
        margin: 0;
      }

      .register-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      label {
        color: #333;
        font-weight: 500;
      }

      .cursor-pointer {
        cursor: pointer;
      }

      .mb-4 {
        margin-bottom: 16px;
      }

      .auth-link {
        text-align: center;
        margin-top: 16px;
        color: #7f8c8d;
      }

      .link-text {
        color: #3498db;
      }

      .link-text:hover {
        text-decoration: underline;
      }

      ::ng-deep .ant-input-affix-wrapper {
        padding: 8px 11px;
      }

      ::ng-deep .ant-input {
        padding: 8px 11px;
        height: auto;
      }

      ::ng-deep .ant-btn {
        height: 42px;
        font-size: 16px;
      }

      ::ng-deep .ant-card-body {
        padding: 32px;
      }
    `,
  ],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild("background") backgroundRef!: ElementRef;
  formData = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  };

  showPassword = false;
  errorMessage = "";
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
  }
  initThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: this.backgroundRef.nativeElement,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 2000; i++) {
      vertices.push((Math.random() * 2 - 1) * 500);
      vertices.push((Math.random() * 2 - 1) * 500);
      vertices.push((Math.random() * 2 - 1) * 500);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      stars.rotation.x += 0.001;
      stars.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.errorMessage = "";

      this.authService.register(this.formData).subscribe({
        next: () => {
          this.notification.success(
            "Thành công",
            "Bạn đã đăng ký thành công! Vui lòng đăng nhập."
          );
          this.router.navigate(["/login"]);
        },
        error: (error) => {
          console.error("Đăng ký thất bại:", error);
          this.notification.error(
            "Lỗi đăng ký",
            "Đăng ký thất bại. Vui lòng thử lại."
          );
          this.errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  private isFormValid(): boolean {
    return Object.values(this.formData).every((value) => value.trim() !== "");
  }
}
