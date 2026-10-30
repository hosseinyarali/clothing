import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  loading = signal(true);

  // --- وضعیت سایدبار و فیلترها ---
  sidebarOpen = signal(false);
  search = signal('');
  selectedCategory = signal<string | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  // لیست دسته‌بندی‌های یکتا از روی خود محصولات
  categories = computed(() =>
    [...new Set(this.products().map(p => p.categoryName).filter(Boolean))]
  );

  // محصولات فیلترشده
  filteredProducts = computed(() => {
    const q = this.search().trim().toLowerCase();
    const cat = this.selectedCategory();
    const min = this.minPrice();
    const max = this.maxPrice();

    return this.products().filter(p =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!cat || p.categoryName === cat) &&
      (min === null || p.basePrice >= min) &&
      (max === null || p.basePrice <= max)
    );
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => { this.products.set(data); this.loading.set(false); },
      error: (err) => { console.error(err); this.loading.set(false); }
    });
  }

  resetFilters(): void {
    this.search.set('');
    this.selectedCategory.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }
}
