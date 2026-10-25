import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, ProductImage } from '../../models/product.model';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cart = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);
  selectedIndex = signal(0);
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);

  // زوم
  zoomOpen = signal(false);
  zoomLevel = signal(1);
  hoverZoom = signal(false);
  zoomOrigin = signal('50% 50%');

  // تصاویر به‌صورت { url, color }
  images = computed<ProductImage[]>(() => {
    const p = this.product();
    if (!p) return [];

    if (p.images && p.images.length) return p.images;

    if (p.imageUrl) return [{ url: p.imageUrl, color: null }];

    return [{ url: 'assets/images/placeholder.jpg', color: null }];
  });

  sizes = computed(() =>
    [...new Set((this.product()?.variants ?? []).map(v => v.size).filter(Boolean))] as string[]);

  colors = computed(() =>
    [...new Set((this.product()?.variants ?? []).map(v => v.color).filter(Boolean))] as string[]);

  selectedVariant = computed(() =>
    (this.product()?.variants ?? []).find(v =>
      (!this.selectedSize() || v.size === this.selectedSize()) &&
      (!this.selectedColor() || v.color === this.selectedColor())));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: p => {
        this.product.set(p);
        this.loading.set(false);
        // اگر تصویر اول رنگ داشت، رنگ رو انتخاب کن
        const firstColor = this.images()[0]?.color;
        if (firstColor && !this.selectedColor()) {
          this.selectedColor.set(firstColor);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  select(i: number) {
    this.selectedIndex.set(i);
    this.zoomLevel.set(1);
    // sync رنگ انتخاب‌شده با رنگ تصویر
    const color = this.images()[i]?.color;
    if (color) this.selectedColor.set(color);
  }

  next() {
    const len = this.images().length;
    if (len < 2) return;
    const i = (this.selectedIndex() + 1) % len;
    this.select(i);
  }

  prev() {
    const len = this.images().length;
    if (len < 2) return;
    const i = (this.selectedIndex() - 1 + len) % len;
    this.select(i);
  }

  // زوم هنگام حرکت ماوس روی عکس اصلی
  onMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    this.zoomOrigin.set(`${x}% ${y}%`);
  }

  // زوم تمام‌صفحه (لایت‌باکس)
  openZoom() { this.zoomOpen.set(true); this.zoomLevel.set(1); }
  closeZoom() { this.zoomOpen.set(false); }
  zoomIn() { this.zoomLevel.update(z => Math.min(z + 0.5, 4)); }
  zoomOut() { this.zoomLevel.update(z => Math.max(z - 0.5, 1)); }


  addToCart() {
    const p = this.product();
    if (!p) return;

    const v = this.selectedVariant();
    const img = this.images()[this.selectedIndex()];

    this.cart.add({
      variantId: v?.id ?? p.id,
      productId: p.id,
      name: p.name,
      imageUrl: img?.url ?? p.imageUrl,
      size: v?.size ?? this.selectedSize(),
      color: v?.color ?? this.selectedColor(),
      price: v?.price ?? p.basePrice,
      quantity: 1,
      maxStock: v?.stockQuantity ?? 999
    });
  }
}
