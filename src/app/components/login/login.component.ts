import { color } from "./../../../../node_modules/@types/three/src/Three.TSL.d";
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
import { AuthService } from "../../services/auth.service";
import * as THREE from "three";

@Component({
  selector: "app-login",
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
      <div class="stars"></div>
      <!-- Hiệu ứng galaxy -->
      <nz-card [nzBorderless]="true" class="login-card">
        <div class="login-header">
          <h2 nz-typography nzType="secondary">Đăng Nhập</h2>
          <p nz-typography nzType="secondary">Chào mừng bạn quay lại!</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="username" for="username" nz-typography
              >Tên đăng nhập</label
            >
            <nz-input-group [nzPrefix]="userIcon">
              <input
                type="text"
                nz-input
                id="username"
                [(ngModel)]="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </nz-input-group>
          </div>

          <div class="form-group">
            <label class="password" for="password" nz-typography
              >Mật khẩu</label
            >
            <nz-input-group [nzPrefix]="lockIcon" [nzSuffix]="suffixTemplate">
              <input
                [type]="showPassword ? 'text' : 'password'"
                nz-input
                id="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Nhập mật khẩu"
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
            Đăng Nhập
          </button>
        </form>

        <nz-divider nzText="HOẶC"></nz-divider>

        <p class="auth-link">
          Chưa có tài khoản?
          <a
            routerLink="/register"
            nz-typography
            nzType="secondary"
            class="link-text"
          >
            Đăng ký
          </a>
        </p>
      </nz-card>
    </div>

    <ng-template #userIcon>
      <span nz-icon nzType="user" nzTheme="outline"></span>
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
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
      }
      .auth-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 350px;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.3);
      }

      .username {
        color: #ffffff;
      }

      .password {
        color: #ffffff;
      }

      .login-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .login-header h2 {
        margin-bottom: 8px;
        color: rgb(91, 173, 255);
        font-size: 24px;
        font-weight: 600;
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
        gap: 8px;   
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
export class LoginComponent implements AfterViewInit {
  @ViewChild("background") backgroundRef!: ElementRef;
  username = "";
  password = "";
  showPassword = false;
  errorMessage = "";
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}
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
    if (this.username && this.password) {
      this.isLoading = true;
      this.errorMessage = "";

      this.authService
        .login({
          username: this.username,
          password: this.password,
        })
        .subscribe({
          next: () => {
            this.router.navigate(["/home"]);
          },
          error: (error) => {
            console.error("Login failed:", error);
            this.errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    }
  }
}
