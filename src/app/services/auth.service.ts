import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  Users,
} from "../models/auth.model";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = "http://localhost:8080";
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private jwtHelper = new JwtHelperService();
  private profileSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadProfileFromAPI(); // Tự động lấy profile khi app khởi động
    this.checkLoginStatus();
  }

  //  Lấy thông tin user từ JWT
  // private loadProfileFromToken() {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const decodedToken: any = this.jwtHelper.decodeToken(token);
  //     if (decodedToken) {
  //       const profile: User = {
  //         firstName: decodedToken.given_name,
  //         lastName: decodedToken.family_name,
  //         username: decodedToken.preferred_username,
  //         email: decodedToken.email,
  //       };
  //       console.log(profile);
  //       this.profileSubject.next(profile);
  //       this.isAuthenticatedSubject.next(true);
  //     }
  //   }
  // }

  loadProfileFromAPI() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Không có token. Người dùng chưa đăng nhập.");
      this.isAuthenticatedSubject.next(false);
      this.profileSubject.next(null);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<{ data: User }>(`${this.baseUrl}/profile`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response.data.email);
          this.profileSubject.next(response.data);
          this.isAuthenticatedSubject.next(true);
        },
        error: (err) => {
          console.error("Lỗi khi tải profile:", err);
          this.isAuthenticatedSubject.next(false);
          this.profileSubject.next(null);
        },
      });
  }

  getProfile(): Observable<User | null> {
    return this.profileSubject.asObservable();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((response) => {
        localStorage.setItem("token", response.data.access_token);
        document.cookie = `token=${response.data.access_token}; path=/`;

        const decodedToken: any = this.jwtHelper.decodeToken(
          response.data.access_token
        );
        console.log("Thông tin token:", decodedToken);

        const roles = decodedToken?.realm_access?.roles || [];
        console.log("Vai trò của người dùng:", roles);

        if (roles.includes("ADMIN")) {
          console.log("có admin");
          localStorage.setItem("role", "admin");
          this.router.navigate(["/user"]);
        } else {
          console.log("Không có");
          localStorage.setItem("role", "user");
          this.router.navigate(["/home"]);
        }
        // this.isAuthenticatedSubject.next(true);
        this.checkLoginStatus();
      })
    );
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      console.log("Thông tin token:", decodedToken);

      const roles = decodedToken?.realm_access?.roles || [];
      console.log("Vai trò của người dùng:", roles);

      if (roles.includes("ADMIN")) {
        console.log("Có admin");
        this.router.navigate(["/user"]);
      } else {
        console.log("Không có admin");
        this.router.navigate(["/home"]);
      }

      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  getAllUsers(): Observable<{ code: number; data: Users[] }> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ code: number; data: Users[] }>(
      `${this.baseUrl}/profiles`,
      { headers }
    );
  }

  deleteUser(userId: number): Observable<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated.");
    }

    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<void>(`${this.baseUrl}/delete/${userId}`, {
      headers,
    });
  }
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request);
  }

  logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    this.isAuthenticatedSubject.next(false);
    this.profileSubject.next(null);

    this.router.navigate(["/login"]);

    console.log("Đã logout và reset trạng thái.");
  }

  downloadPdf(): void {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get(`${this.baseUrl}/generate-pdf`, { headers, responseType: "blob" }) // Quan trọng: responseType là "blob"
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "report_user.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        error: (err) => console.error("Lỗi khi tải PDF:", err),
      });
  }

  downloadExcel(): void {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get(`${this.baseUrl}/generate-excel`, {
        headers,
        responseType: "blob", // Quan trọng: responseType là "blob"
      })
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "report_user.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        error: (err) => console.error("Lỗi khi tải Excel:", err),
      });
  }
}
