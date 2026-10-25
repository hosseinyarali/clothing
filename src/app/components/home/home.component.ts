import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ==================== HERO ==================== -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="eyebrow">کالکشن جدید ۱۴۰۴</p>
        <h1>
          استایل خودت رو
          <span class="accent">بساز</span>
        </h1>
        <p class="sub">
          پوشاک باکیفیت، طراحی مینیمال و قیمت منصفانه.
          کالکشن جدید مردانه و زنانه الان در دسترسه.
        </p>
        <div class="hero-actions">
          <a routerLink="/products" class="cta">مشاهده محصولات</a>
          <a routerLink="/categories" class="cta ghost">دسته‌بندی‌ها</a>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURES ==================== -->
    <section class="features">
      <div class="feature">
        <span class="icon">🚚</span>
        <strong>ارسال سریع</strong>
        <small>به سراسر کشور</small>
      </div>
      <div class="feature">
        <span class="icon">✅</span>
        <strong>ضمانت اصالت</strong>
        <small>تضمین کیفیت</small>
      </div>
      <div class="feature">
        <span class="icon">🔄</span>
        <strong>بازگشت آسان</strong>
        <small>تا ۷ روز</small>
      </div>
      <div class="feature">
        <span class="icon">💳</span>
        <strong>پرداخت امن</strong>
        <small>درگاه معتبر</small>
      </div>
    </section>

    <!-- ==================== CATEGORIES ==================== -->
    @if (categories().length > 0) {
      <section class="section">
        <div class="section-head">
          <div>
            <h2>دسته‌بندی‌ها</h2>
            <p class="muted">از کجا شروع می‌کنی؟</p>
          </div>
          <a routerLink="/categories" class="link-more">همه ←</a>
        </div>

        <div class="cat-grid">
          @for (c of categories(); track c.id) {
            <a [routerLink]="['/products']"
               [queryParams]="{ categoryId: c.id }"
               class="cat-card">
              @if (c.imageUrl) {
                <img [src]="c.imageUrl" [alt]="c.name" />
              } @else {
                <div class="cat-placeholder">👕</div>
              }
              <div class="cat-overlay"></div>
              <span class="cat-name">{{ c.name }}</span>
            </a>
          }
        </div>
      </section>
    }

    <!-- ==================== PRODUCTS ==================== -->
    <section class="section">
      <div class="section-head">
        <div>
          <h2>جدیدترین محصولات</h2>
          <p class="muted">تازه رسیده‌ها</p>
        </div>
        <a routerLink="/products" class="link-more">همه ←</a>
      </div>

      @if (loading()) {
        <div class="product-grid">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="skeleton">
              <div class="skeleton-img"></div>
              <div class="skeleton-line w-70"></div>
              <div class="skeleton-line w-40"></div>
            </div>
          }
        </div>
      } @else if (products().length === 0) {
        <p class="empty">هنوز محصولی ثبت نشده.</p>
      } @else {
        <div class="product-grid">
          @for (p of products(); track p.id) {
            <a [routerLink]="['/products', p.id]" class="product-card">
              <div class="product-img-wrap">
                <img
                  [src]="p.imageUrl || 'assets/images/placeholder.jpg'"
                  [alt]="p.name"
                  loading="lazy" />
                <span class="badge">جدید</span>
              </div>
              <div class="product-info">
                <p class="cat-label">{{ p.categoryName }}</p>
                <h3 class="product-name">{{ p.name }}</h3>
                <p class="product-price">
                  {{ p.basePrice | number }}
                  <span>تومان</span>
                </p>
              </div>
            </a>
          }
        </div>
      }
    </section>

    <!-- ==================== BANNER ==================== -->
    <section class="section">
      <div class="banner">
        <h2>تخفیف ویژه کالکشن پاییزه</h2>
        <p>تا ۳۰٪ تخفیف روی منتخب محصولات — فقط تا پایان هفته</p>
        <a routerLink="/products" class="cta dark">همین حالا خرید کن</a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ---------- HERO ---------- */
    .hero {
      position: relative;
      background: linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 50%, #2a2a2a 100%);
      color: #fff;
      padding: 96px 20px 80px;
      overflow: hidden;
      text-align: center;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background-image:
        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 1px, transparent 1px),
        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .hero-content {
      position: relative;
      max-width: 720px;
      margin: 0 auto;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 4px;
      color: #9ca3af;
      margin-bottom: 16px;
    }
    .hero h1 {
      font-size: clamp(32px, 6vw, 56px);
      line-height: 1.15;
      margin: 0 0 20px;
      font-weight: 800;
    }
    .accent {
      background: linear-gradient(90deg, #f5c451, #e0a82e);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .sub {
      font-size: 16px;
      line-height: 1.9;
      color: #d1d5db;
      margin: 0 auto 32px;
      max-width: 520px;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .cta {
      display: inline-block;
      background: #f5c451;
      color: #111;
      padding: 14px 32px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      transition: transform .2s, background .2s;
    }
    .cta:hover { background: #e0a82e; transform: translateY(-2px); }
    .cta.ghost {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .cta.ghost:hover { background: rgba(255,255,255,0.1); }
    .cta.dark {
      background: #111;
      color: #fff;
    }
    .cta.dark:hover { background: #333; }

    /* ---------- FEATURES ---------- */
    .features {
      max-width: 1100px;
      margin: -40px auto 0;
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      padding: 0 20px;
      z-index: 2;
    }
    .feature {
      background: #fff;
      padding: 22px 18px;
      border-radius: 14px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .feature .icon { font-size: 26px; }
    .feature strong { font-size: 15px; color: #111; }
    .feature small { font-size: 12px; color: #6b7280; }

    /* ---------- SECTIONS ---------- */
    .section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 72px 20px 0;
    }
    .section-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 28px;
      gap: 16px;
    }
    .section-head h2 {
      font-size: 24px;
      font-weight: 800;
      color: #111;
      margin: 0;
    }
    .muted { font-size: 13px; color: #6b7280; margin: 4px 0 0; }
    .link-more {
      font-size: 13px;
      color: #6b7280;
      text-decoration: none;
      transition: color .2s;
    }
    .link-more:hover { color: #111; }

    /* ---------- CATEGORIES ---------- */
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 14px;
    }
    .cat-card {
      position: relative;
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      background: #f3f4f6;
      display: block;
    }
    .cat-card img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform .5s;
    }
    .cat-card:hover img { transform: scale(1.06); }
    .cat-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-size: 40px; color: #d1d5db;
    }
    .cat-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%);
    }
    .cat-name {
      position: absolute;
      bottom: 12px; right: 12px; left: 12px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }

    /* ---------- PRODUCTS ---------- */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .product-card {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .product-img-wrap {
      position: relative;
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      background: #f3f4f6;
    }
    .product-img-wrap img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform .5s;
    }
    .product-card:hover .product-img-wrap img { transform: scale(1.06); }
    .badge {
      position: absolute;
      top: 10px; right: 10px;
      background: rgba(255,255,255,0.92);
      color: #111;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      font-weight: 600;
    }
    .product-info { margin-top: 10px; }
    .cat-label {
      font-size: 11px;
      color: #9ca3af;
      margin: 0;
    }
    .product-name {
      font-size: 14px;
      font-weight: 600;
      color: #111;
      margin: 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .product-price {
      font-size: 14px;
      font-weight: 800;
      color: #111;
      margin: 0;
    }
    .product-price span {
      font-size: 11px;
      font-weight: 400;
      color: #6b7280;
    }
    .empty {
      text-align: center;
      color: #9ca3af;
      padding: 60px 0;
    }

    /* ---------- SKELETON ---------- */
    .skeleton { animation: pulse 1.6s infinite ease-in-out; }
    .skeleton-img {
      aspect-ratio: 1;
      border-radius: 16px;
      background: #e5e7eb;
    }
    .skeleton-line {
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      margin-top: 10px;
    }
    .w-70 { width: 70%; }
    .w-40 { width: 40%; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }

    /* ---------- BANNER ---------- */
    .banner {
      background: linear-gradient(135deg, #fef3c7, #fde68a 40%, #fcd34d);
      border-radius: 24px;
      padding: 56px 24px;
      text-align: center;
    }
    .banner h2 {
      font-size: clamp(22px, 4vw, 32px);
      font-weight: 800;
      color: #111;
      margin: 0 0 10px;
    }
    .banner p {
      color: #4b5563;
      margin: 0 0 24px;
      font-size: 15px;
    }

    @media (max-width: 640px) {
      .hero { padding: 72px 16px 64px; }
      .features { margin-top: -32px; }
      .section { padding-top: 56px; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data.slice(0, 8));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data.slice(0, 6)),
      error: () => {}
    });
  }
}
