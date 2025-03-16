import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment-success",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-success-container">
      <h1>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng.</p>
      <p>Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
      <p>Bạn sẽ nhận được email xác nhận chi tiết đơn hàng.</p>
      <button (click)="goToOrders()">Xem đơn hàng</button>
      <button (click)="goToHome()">Trang chủ</button>
    </div>
  `,
  styles: [
    `
      .payment-success-container {
        text-align: center;
        padding: 50px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 50px auto;
        max-width: 600px;
      }

      h1 {
        color: #28a745;
      }

      p {
        margin-bottom: 15px;
      }

      button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
      }

      button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToOrders() {
    this.router.navigate(["/order"]);
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }
}
