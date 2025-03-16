import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-payment-failure",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-failure-container">
      <h1>Thanh toán thất bại!</h1>
      <p>Có lỗi xảy ra trong quá trình thanh toán.</p>
      <p>Vui lòng kiểm tra lại thông tin thẻ của bạn hoặc thử lại sau.</p>
      <p>Nếu vấn đề vẫn tiếp diễn, hãy liên hệ với bộ phận hỗ trợ.</p>
      <button (click)="tryAgain()">Thử lại</button>
      <button (click)="goToHome()">Trang chủ</button>
    </div>
  `,
  styles: [
    `
      .payment-failure-container {
        text-align: center;
        padding: 50px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 50px auto;
        max-width: 600px;
      }

      h1 {
        color: #dc3545; /* Red color for failure */
      }

      p {
        margin-bottom: 15px;
      }

      button {
        background-color: #dc3545;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin: 10px;
      }

      button:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class PaymentFailureComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Optionally extract error details from query parameters
    this.route.queryParams.subscribe((params) => {
      console.log(
        "Payment Error Details from Payment Gateway, Error Details : " +
          JSON.stringify(params)
      );
    });
  }

  tryAgain() {
    this.router.navigate(["/product"]); // Or navigate back to the checkout page
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }
}
