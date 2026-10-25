import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/payment';

  // ایجاد درخواست پرداخت — فقط orderId
  // مبلغ رو بک‌اند از دیتابیس می‌خونه (امن‌تره)
  createPayment(orderId: number): Observable<{ paymentUrl: string }> {
    return this.http.post<{ paymentUrl: string }>(
      `${this.apiUrl}/create`,
      { orderId }
    );
  }

  // تأیید پرداخت بعد از بازگشت از درگاه
  verifyPayment(orderId: number, authority: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(
      `${this.apiUrl}/verify/${orderId}`,
      null,
      { params: { authority } }
    );
  }
}
