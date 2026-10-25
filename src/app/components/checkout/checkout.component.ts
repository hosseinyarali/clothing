import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { LocationService } from '../../services/location.service';
import { CreateOrderRequest } from '../../models/order.model';
import { LocationResponse } from '../../models/location.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected cart = inject(CartService);
  private orderService = inject(OrderService);
  private locationService = inject(LocationService);
  private router = inject(Router);

  saving = signal(false);
  error = signal<string | null>(null);

  // لیست‌های استان و شهر
  provinces = signal<LocationResponse[]>([]);
  cities = signal<LocationResponse[]>([]);
  loadingProvinces = signal(false);
  loadingCities = signal(false);

  // فعلاً hardcode — بعداً از AuthService می‌گیریم
  private customerId = 1;

  form = this.fb.nonNullable.group({
    provinceId: [null as number | null, [Validators.required]],
    cityId: [null as number | null, [Validators.required]],
    street: ['', [Validators.required, Validators.maxLength(500)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    receiverName: ['', [Validators.required, Validators.maxLength(100)]],
    receiverPhone: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    note: ['', [Validators.maxLength(1000)]]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    if (this.cart.items().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.loadProvinces();
  }

  private loadProvinces() {
    this.loadingProvinces.set(true);
    this.locationService.getProvinces().subscribe({
      next: (list) => {
        this.provinces.set(list);
        this.loadingProvinces.set(false);
      },
      error: () => {
        this.error.set('خطا در بارگذاری استان‌ها.');
        this.loadingProvinces.set(false);
      }
    });
  }

  onProvinceChange(provinceId: number | null) {
    // ریست شهرها
    this.cities.set([]);
    this.form.patchValue({ cityId: null });

    if (!provinceId) return;

    this.loadingCities.set(true);
    this.locationService.getCities(provinceId).subscribe({
      next: (list) => {
        this.cities.set(list);
        this.loadingCities.set(false);
      },
      error: () => {
        this.error.set('خطا در بارگذاری شهرها.');
        this.loadingCities.set(false);
      }
    });
  }

  submit() {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.cart.items().length === 0) {
      this.error.set('سبد خرید خالی است.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();

    // اسم استان و شهر رو از لیست پیدا کن (برای snapshot رشته‌ای)
    const provinceName = this.provinces().find(p => p.id === raw.provinceId)?.name ?? '';
    const cityName = this.cities().find(c => c.id === raw.cityId)?.name ?? '';

    const req: CreateOrderRequest = {
      shipping: {
        province: provinceName,
        city: cityName,
        street: raw.street.trim(),
        postalCode: raw.postalCode.trim(),
        receiverName: raw.receiverName.trim(),
        receiverPhone: raw.receiverPhone.trim()
      },
      items: this.cart.items().map(i => ({
        variantId: i.variantId,
        quantity: i.quantity
      })),
      note: raw.note?.trim() || null
    };

    this.orderService.create(req, this.customerId).subscribe({
      next: (order) => {
        this.cart.clear();
        this.saving.set(false);
        this.router.navigate(['/orders', order.id], {
          queryParams: { success: '1' }
        });
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'خطا در ثبت سفارش. دوباره تلاش کنید.');
      }
    });
  }
}
