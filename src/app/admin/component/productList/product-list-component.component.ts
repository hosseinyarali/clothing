import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DecimalPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponentComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  search = signal('');

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q
      ? this.products().filter(p => p.name.toLowerCase().includes(q))
      : this.products();
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getAll().subscribe({
      next: data => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('خطا در دریافت لیست محصولات');
        this.loading.set(false);
      },
    });
  }

  remove(p: Product) {
    if (!confirm(`محصول «${p.name}» حذف شود؟`)) return;
    this.productService.delete(p.id).subscribe({
      next: () => this.products.update(list => list.filter(x => x.id !== p.id)),
      error: () => alert('حذف محصول ناموفق بود'),
    });
  }

  totalStock(p: Product): number {
    return p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
  }
}
