import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
    <div class="page" dir="rtl">

      <!-- ==================== SIDEBAR ==================== -->
      <aside class="sidebar">
        <div class="box">
          <h3 class="box-title">دسته‌بندی‌ها</h3>
          <ul class="cat-list">
            <li><a routerLink="/products" class="cat-link strong">همه محصولات</a></li>
            @for (c of categories(); track c.id) {
              <li>
                <a [routerLink]="['/products']" [queryParams]="{ categoryId: c.id }" class="cat-link">
                  {{ c.name }}
                </a>
              </li>
            }
          </ul>
        </div>

        <div class="box perks">
          <div class="perk"><span>🚚</span> ارسال سریع به سراسر کشور</div>
          <div class="perk"><span>✅</span> ضمانت اصالت کالا</div>
          <div class="perk"><span>🔄</span> بازگشت آسان تا ۷ روز</div>
          <div class="perk"><span>💳</span> پرداخت امن</div>
        </div>

        <a routerLink="/products" class="promo">
          <strong>تا ۳۰٪ تخفیف</strong>
          <small>کالکشن پاییزه</small>
        </a>
      </aside>

      <!-- ==================== CONTENT ==================== -->
      <main class="content">

        <!-- HERO -->
        <section class="hero">
          <div class="hero-text">
            <span class="tag">کالکشن جدید ۱۴۰۴</span>
            <h1>استایل خودت رو بساز</h1>
            <p>پوشاک باکیفیت با طراحی مینیمال و قیمت منصفانه. کالکشن جدید مردانه و زنانه الان در دسترسه.</p>
            <a routerLink="/products" class="btn">مشاهده محصولات</a>
          </div>
          @if (heroProduct(); as hp) {
            <div class="hero-img">
              <img [src]="hp.imageUrl || 'assets/images/placeholder.jpg'" [alt]="hp.name" />
            </div>
          }
        </section>

        <!-- PRODUCTS -->
        <section class="block">
          <div class="block-head">
            <h2>جدیدترین محصولات</h2>
            <a routerLink="/products" class="more">مشاهده همه</a>
          </div>

          @if (loading()) {
            <div class="grid">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div>
                  <div class="sk sk-img"></div>
                  <div class="sk sk-line"></div>
                  <div class="sk sk-line short"></div>
                </div>
              }
            </div>
          } @else if (products().length === 0) {
            <p class="empty">هنوز محصولی ثبت نشده.</p>
          } @else {
            <div class="grid">
              @for (p of products(); track p.id; let i = $index) {
                <a [routerLink]="['/products', p.id]" class="card" [style.--i]="i">
                  <div class="img-wrap">
                    <img [src]="p.imageUrl || 'assets/images/placeholder.jpg'" [alt]="p.name" loading="lazy" />
                    <span class="badge">جدید</span>
                  </div>
                  <div class="info">
                    <p class="cat">{{ p.categoryName }}</p>
                    <h3 class="name">{{ p.name }}</h3>
                    <p class="price">{{ p.basePrice | number }} <span>تومان</span></p>
                  </div>
                </a>
              }
            </div>
          }
        </section>

        <!-- BANNER -->
        <section class="banner">
          <div>
            <h2>تخفیف ویژه کالکشن پاییزه</h2>
            <p>تا ۳۰٪ تخفیف روی منتخب محصولات، فقط تا پایان هفته</p>
          </div>
          <a routerLink="/products" class="btn light">خرید کن</a>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      --ink: #1f2937;
      --muted: #6b7280;
      --line: #e5e7eb;
      --soft: #f3f4f6;
      --accent: #2563eb;
      --accent-d: #1d4ed8;
      font-family: inherit;
      color: var(--ink);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    a { color: inherit; text-decoration: none; }

    .page {
      display: grid;
      grid-template-columns: 230px minmax(0, 1fr);
      gap: 24px;
      align-items: start;
    }

    /* ================= SIDEBAR ================= */
    .sidebar {
      position: sticky;
      top: 80px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .box {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px;
    }
    .box-title {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 8px;
    }
    .cat-list { list-style: none; margin: 0; padding: 0; }
    .cat-link {
      display: block;
      padding: 8px 10px;
      font-size: 13px;
      color: #4b5563;
      border-radius: 8px;
      transition: background .2s, color .2s, padding .25s ease;
    }
    .cat-link:hover {
      background: #eff6ff;
      color: var(--accent);
      padding-right: 14px;
    }
    .cat-link.strong { font-weight: 600; color: var(--ink); }

    .perks { display: flex; flex-direction: column; gap: 10px; }
    .perk { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
    .perk span { font-size: 15px; }

    .promo {
      display: flex; flex-direction: column; gap: 2px;
      padding: 14px;
      border-radius: 12px;
      background: var(--accent);
      color: #fff;
      transition: background .2s;
    }
    .promo:hover { background: var(--accent-d); }
    .promo strong { font-size: 14px; }
    .promo small { font-size: 12px; opacity: .85; }

    /* ================= HERO ================= */
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 16px;
      padding: 28px 32px;
      overflow: hidden;
    }
    .hero-text { max-width: 420px; animation: slide-in .7s ease both; }
    .tag {
      display: inline-block;
      font-size: 12px;
      color: var(--accent);
      background: #fff;
      padding: 3px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .hero h1 { font-size: 26px; font-weight: 800; margin: 0 0 8px; line-height: 1.5; }
    .hero p { font-size: 13px; line-height: 2; color: #4b5563; margin: 0 0 18px; }
    .hero-img {
      width: 170px; height: 190px;
      flex-shrink: 0;
      border-radius: 14px;
      overflow: hidden;
      animation: pop .8s ease .15s both;
    }
    .hero-img img { width: 100%; height: 100%; object-fit: cover; }

    .btn {
      display: inline-block;
      background: var(--accent);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 9px 22px;
      border-radius: 10px;
      transition: background .2s, transform .2s;
    }
    .btn:hover { background: var(--accent-d); transform: translateY(-2px); }
    .btn.light { background: #fff; color: var(--accent); }
    .btn.light:hover { background: #eff6ff; }

    /* ================= PRODUCTS ================= */
    .block { margin-top: 32px; }
    .block-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .block-head h2 { font-size: 17px; font-weight: 700; margin: 0; }
    .more { font-size: 12px; color: var(--accent); }
    .more:hover { text-decoration: underline; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
    .card {
      display: block;
      animation: fade-up .5s ease both;
      animation-delay: calc(var(--i) * 50ms);
    }
    .img-wrap {
      position: relative;
      aspect-ratio: 4 / 5;
      border-radius: 12px;
      overflow: hidden;
      background: var(--soft);
    }
    .img-wrap img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform .5s ease;
    }
    .card:hover .img-wrap img { transform: scale(1.05); }
    .badge {
      position: absolute; top: 8px; right: 8px;
      background: var(--accent);
      color: #fff;
      font-size: 10px;
      padding: 2px 9px;
      border-radius: 999px;
    }
    .info { padding-top: 8px; }
    .cat { font-size: 11px; color: var(--muted); margin: 0; }
    .name {
      font-size: 13px; font-weight: 600;
      margin: 3px 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .price { font-size: 13px; font-weight: 700; margin: 0; }
    .price span { font-size: 11px; font-weight: 400; color: var(--muted); }
    .empty { text-align: center; color: var(--muted); padding: 40px 0; }

    .sk {
      background: linear-gradient(100deg, #eceef1 30%, #f6f7f9 50%, #eceef1 70%);
      background-size: 200% 100%;
      animation: shimmer 1.3s linear infinite;
    }
    .sk-img { aspect-ratio: 4 / 5; border-radius: 12px; }
    .sk-line { height: 10px; border-radius: 5px; margin-top: 9px; }
    .sk-line.short { width: 45%; }

    /* ================= BANNER ================= */
    .banner {
      margin-top: 32px;
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; flex-wrap: wrap;
      background: var(--ink);
      color: #fff;
      border-radius: 14px;
      padding: 22px 26px;
    }
    .banner h2 { font-size: 16px; margin: 0 0 4px; }
    .banner p { font-size: 12px; margin: 0; color: #d1d5db; }

    /* ================= ANIMATIONS ================= */
    @keyframes fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    @keyframes slide-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
    @keyframes pop { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: none; } }
    @keyframes shimmer { to { background-position: -200% 0; } }

    /* ================= RESPONSIVE ================= */
    @media (max-width: 860px) {
      .page { grid-template-columns: 1fr; gap: 16px; }
      .sidebar { position: static; }
      .perks, .promo { display: none; }
      .cat-list { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
      .cat-link { white-space: nowrap; background: var(--soft); padding: 7px 14px; }
      .cat-link:hover { padding-right: 14px; }
      .box { padding: 10px; }
      .box-title { display: none; }
      .hero { padding: 20px; }
      .hero-img { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  heroProduct = computed(() => this.products()[0] ?? null);

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data.slice(0, 8));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.categoryService.getAll().subscribe({
      next: (data) => this.categories.set(data.slice(0, 8)),
      error: () => {}
    });
  }
}
