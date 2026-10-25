import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { OrderResponse } from '../../models/order.model'; // ⬅️ import درست

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html', // ⬅️ بدون s (اسم واقعی فایل)
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailsComponent implements OnInit { // ⬅️ با s
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  loading = signal(true);
  error = signal<string | null>(null);
  order = signal<OrderResponse | null>(null);
  success = signal(false);
  canceling = signal(false);

  paying = signal(false);
  paymentError = signal<string | null>(null);
  paymentSuccess = signal(false);

  // customerId از localStorage (بعد از لاگین ذخیره شده)
  private get customerId(): number {
    const id = localStorage.getItem('customerId');
    return id ? Number(id) : 1; // fallback به 1 برای تست
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.handlePaymentCallback(id);
    this.loadOrder(id);
  }

  // ---------- بارگذاری ----------

  private loadOrder(id: number): void {
    this.loading.set(true);
    this.orderService.getById(id, this.customerId).subscribe({
      next: (o) => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('خطا در دریافت اطلاعات سفارش.');
        this.loading.set(false);
      },
    });
  }

  // ---------- پرداخت ----------

  canPay(): boolean {
    return this.order()?.status === 'PENDING';
  }

  payOrder(): void {
    const currentOrder = this.order();
    if (!currentOrder || !this.canPay()) return;

    this.paying.set(true);
    this.paymentError.set(null);

    this.paymentService.createPayment(currentOrder.id).subscribe({
      next: (res) => {
        window.location.href = res.paymentUrl;
      },
      error: (err: any) => {
        console.error('خطا در اتصال به درگاه:', err);
        this.paying.set(false);
        this.paymentError.set(
          err?.error?.message ?? 'خطا در اتصال به درگاه پرداخت. دوباره تلاش کنید.'
        );
      },
    });
  }

  // ---------- بازگشت از زرین‌پال ----------

  private handlePaymentCallback(orderId: number): void {
    const authority = this.route.snapshot.queryParamMap.get('Authority');
    const status = this.route.snapshot.queryParamMap.get('Status');

    if (!authority) return;

    const clearQuery = () => {
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    };

    if (status !== 'OK') {
      this.paymentError.set('پرداخت لغو شد یا ناموفق بود.');
      clearQuery();
      return;
    }

    this.paying.set(true);
    this.paymentService.verifyPayment(orderId, authority).subscribe({
      next: (res) => {
        this.paying.set(false);
        if (res.status === 'success') {
          this.paymentSuccess.set(true);
          this.loadOrder(orderId);
        } else {
          this.paymentError.set('تأیید پرداخت ناموفق بود.');
        }
        clearQuery();
      },
      error: (err: any) => {
        console.error('خطا در تأیید پرداخت:', err);
        this.paying.set(false);
        this.paymentError.set(err?.error?.message ?? 'خطا در تأیید پرداخت.');
        clearQuery();
      },
    });
  }

  // ---------- لغو ----------

  canCancel(): boolean {
    const s = this.order()?.status;
    return s === 'PENDING' || s === 'PROCESSING';
  }

  cancel(): void {
    const currentOrder = this.order();
    if (!currentOrder) return;
    if (!confirm('آیا از لغو این سفارش مطمئن هستید؟')) return;

    this.canceling.set(true);
    this.orderService.cancel(currentOrder.id, this.customerId).subscribe({
      next: () => {
        this.canceling.set(false);
        this.loadOrder(currentOrder.id);
      },
      error: () => {
        this.canceling.set(false);
        alert('خطا در لغو سفارش.');
      },
    });
  }

  // ---------- وضعیت ----------

  statusClass(status: string): string {
    return {
      PENDING: 'status-pending',
      PAID: 'status-paid',
      PROCESSING: 'status-processing',
      SHIPPED: 'status-shipped',
      DELIVERED: 'status-delivered',
      CANCELED: 'status-canceled',
    }[status] ?? '';
  }

  statusLabel(status: string): string {
    return {
      PENDING: 'در انتظار پرداخت',
      PAID: 'پرداخت شده',
      PROCESSING: 'در حال پردازش',
      SHIPPED: 'ارسال شده',
      DELIVERED: 'تحویل داده شده',
      CANCELED: 'لغو شده',
    }[status] ?? status;
  }
}
