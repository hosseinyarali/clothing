import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderResponse, OrderStatus } from '../../models/order.model';
import { CartService } from '../../services/cart.service';

type FilterKey = 'ALL' | OrderStatus;

interface FilterTab {
  key: FilterKey;
  label: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  protected cart = inject(CartService);

  orders = signal<OrderResponse[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  activeFilter = signal<FilterKey>('ALL');

  private customerId = 1;

  readonly tabs: FilterTab[] = [
    { key: 'ALL', label: 'همه' },
    { key: 'PENDING', label: 'در انتظار پرداخت' },   // ← PENDING (هماهنگ با مدل)
    { key: 'PAID', label: 'پرداخت‌شده' },
    { key: 'PROCESSING', label: 'در حال پردازش' },
    { key: 'SHIPPED', label: 'ارسال‌شده' },
    { key: 'DELIVERED', label: 'تحویل‌شده' },
    { key: 'CANCELED', label: 'لغو‌شده' },
    { key: 'RETURNED', label: 'مرجوع‌شده' },         // ← RETURNED اضافه شد
  ];

  filteredOrders = computed(() => {
    const f = this.activeFilter();
    const list = this.orders();
    if (f === 'ALL') return list;
    return list.filter(o => o.status === f);
  });

  countFor(key: FilterKey): number {
    if (key === 'ALL') return this.orders().length;
    return this.orders().filter(o => o.status === key).length;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.error.set(null);

    this.orderService.getMyOrders(this.customerId).subscribe({
      next: (list) => {
        this.orders.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'خطا در بارگذاری سفارش‌ها.');
        this.loading.set(false);
      }
    });
  }

  setFilter(key: FilterKey) {
    this.activeFilter.set(key);
  }

  statusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      PENDING: 'در انتظار پرداخت',   // ← PENDING
      PAID: 'پرداخت‌شده',
      PROCESSING: 'در حال پردازش',
      SHIPPED: 'ارسال‌شده',
      DELIVERED: 'تحویل‌شده',
      CANCELED: 'لغو‌شده',
      RETURNED: 'مرجوع‌شده'           // ← RETURNED
    };
    return map[status] ?? status;
  }

  statusClass(status: OrderStatus): string {
    switch (status) {
      case 'PENDING': return 'pending';              // ← PENDING
      case 'PAID':
      case 'PROCESSING':
      case 'SHIPPED': return 'info';
      case 'DELIVERED': return 'success';
      case 'CANCELED':
      case 'RETURNED': return 'danger';              // ← RETURNED
      default: return '';
    }
  }

  itemCount(o: OrderResponse): number {
    return o.items.reduce((sum, i) => sum + i.quantity, 0);
  }
}
