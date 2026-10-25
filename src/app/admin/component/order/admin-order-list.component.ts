import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AdminOrderService} from "../../service/AdminOrderService";
import {AdminOrder, OrderStatus} from "../../dto/AdminOrder";
@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css'],
})
export class AdminOrderListComponent implements OnInit {
  private orderService = inject(AdminOrderService);

  orders = signal<AdminOrder[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filter = signal<OrderStatus | ''>('');

  statuses: { value: OrderStatus; label: string }[] = [
    { value: 'PENDING', label: 'در انتظار پرداخت' },
    { value: 'PAID', label: 'پرداخت‌شده' },
    { value: 'SHIPPED', label: 'ارسال‌شده' },
    { value: 'DELIVERED', label: 'تحویل‌شده' },
    { value: 'CANCELED', label: 'لغوشده' },
  ];

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    const status = this.filter() || undefined;
    this.orderService.getAll(status).subscribe({
      next: data => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('خطا در دریافت سفارش‌ها');
        this.loading.set(false);
      },
    });
  }

  onFilterChange(v: OrderStatus | '') {
    this.filter.set(v);
    this.load();
  }

  changeStatus(order: AdminOrder, status: OrderStatus) {
    const previous = order.status;
    this.orderService.updateStatus(order.id, status).subscribe({
      next: updated =>
        this.orders.update(list => list.map(o => (o.id === updated.id ? updated : o))),
      error: () => {
        alert('تغییر وضعیت ناموفق بود');
        this.orders.update(list =>
          list.map(o => (o.id === order.id ? { ...o, status: previous } : o))
        );
      },
    });
  }

  label(s: OrderStatus) {
    return this.statuses.find(x => x.value === s)?.label ?? s;
  }
}
