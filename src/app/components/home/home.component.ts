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
} from "@ant-design/icons-angular/icons";
import { FormsModule } from "@angular/forms";

const icons: IconDefinition[] = [UserOutline, MailOutline, IdcardOutline];

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

      <main class="profile-container">
        <div class="cards-wrapper">
          <div class="profile-card">
            <img
              src="https://bootdey.com/img/Content/avatar/avatar7.png"
              alt="Profile Avatar"
              class="profile-avatar"
            />
            <h2 class="profile-name">
              {{ profile?.firstName }} {{ profile?.lastName }}
            </h2>
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

          <div class="details-card">
            <h3 class="details-title">Profile Details</h3>

            <div class="name-row">
              <div class="details-row-item">
                <span class="details-label">First Name:</span>
                <input
                  type="text"
                  [(ngModel)]="profile!.firstName"
                  class="text-input"
                />
              </div>
              <div class="details-row-item">
                <span class="details-label">Last Name:</span>
                <input
                  type="text"
                  [(ngModel)]="profile!.lastName"
                  class="text-input"
                />
              </div>
            </div>

            <div class="details-row">
              <span class="details-label">Full Name:</span>
              <input
                type="text"
                [value]="profile?.firstName + ' ' + profile?.lastName"
                class="text-input"
                disabled
              />
            </div>

            <div class="details-row">
              <span class="details-label">Email:</span>
              <input
                type="email"
                [(ngModel)]="profile!.email"
                class="text-input"
              />
            </div>

            <div class="details-row">
              <span class="details-label">Username:</span>
              <input
                type="text"
                [value]="profile!.username"
                class="text-input"
                disabled
              />
            </div>

            <button class="edit-button">Edit</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      /* General Styles */
      .container {
        font-family: "Arial", sans-serif;
        background-color: #f5f7fa;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center; /* Center horizontally */
      }

      .header {
        background-color: rgb(147, 142, 235);
        color: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 100%;
        box-sizing: border-box;
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
      /* Profile Container */
      .profile-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start; /* Align items at the top */
        width: 80%; /* Adjust as needed */
        max-width: 1200px; /* Max width for larger screens */
        margin-top: 20px;
        flex: 1; /* Allow profile container to grow to fill remaining vertical space */
      }

      /* Cards Wrapper - to hold profile and details card side by side */
      .cards-wrapper {
        display: flex;
        width: 100%;
        height: auto; /* Important: remove set height for the intended behavior*/
      }

      /* Profile Card */
      .profile-card {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: center;
        width: 25%; /* Smaller width */
        margin-right: 20px; /* add some space for detail card*/
        box-sizing: border-box;
        /* Reset height and flex-grow */
        height: fit-content; /*Set the height to fit content for the desired layout */
        flex-grow: 0;
      }

      .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 15px;
      }

      .profile-name {
        font-size: 24px;
        margin-bottom: 15px;
        color: #333;
      }

      /* Style for icon and text */
      .profile-info {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: #777;
        text-align: left;
      }

      .profile-info i {
        margin-right: 8px;
      }

      /* Circle around the icon */
      .icon-circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #e0e0e0; /* Light Grey background */
        position: relative; /* Add this */
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
      }

      /* Try adjusting font-size in icon-circle */
      .icon-circle i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #777;
      }

      /* Details Card */
      .details-card {
        background-color: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        width: 75%; /* Larger width */
        box-sizing: border-box;
        flex-grow: 1; /* Allow to take remaining verticle space */
        min-height: 500px;
      }

      .details-title {
        font-size: 20px;
        margin-bottom: 15px;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }

      /* Input Box style */
      .text-input {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 8px 10px;
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 8px;
      }

      /* Edit Button */
      .edit-button {
        background-color: #4caf50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        margin-top: 30px;
      }

      .edit-button:hover {
        background-color: #388e3c;
      }

      .profile-info i {
        margin-right: 5px;
        color: #333;
      }

      .profile-info span {
        color: #333;
      }
      .name-row {
        display: flex;
        gap: 10px;
      }
      .name-row > div {
        width: 50%;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  profile?: User | null = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.loadProfileFromAPI();
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error("Error loading profile", err);
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
