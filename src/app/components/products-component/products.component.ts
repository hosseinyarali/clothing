import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // فیلترها
  search = signal('');
  selectedCategoryId = signal<number | null>(null);
  sortKey = signal<SortKey>('newest');

  // فیلترشده و مرتب‌شده
  filtered = computed(() => {
    let list = this.products();

    // جستجو
    const q = this.search().trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }

    // دسته‌بندی
    const cat = this.selectedCategoryId();
    if (cat !== null) {
      list = list.filter(p => p.categoryId === cat);
    }

    // مرتب‌سازی
    const sort = this.sortKey();
    const sorted = [...list];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        break;
      default:
        // newest — بر اساس id نزولی
        sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  });

  ngOnInit(): void {
    // اگر categoryId توی query بود، از اول فیلتر کن
    const qCat = this.route.snapshot.queryParamMap.get('categoryId');
    if (qCat) this.selectedCategoryId.set(Number(qCat));

    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (list) => this.categories.set(list),
      error: () => {}
    });
  }

  private loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getAll().subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'خطا در بارگذاری محصولات.');
        this.loading.set(false);
      }
    });
  }

  clearFilters() {
    this.search.set('');
    this.selectedCategoryId.set(null);
    this.sortKey.set('newest');
  }

  hasActiveFilter(): boolean {
    return !!this.search().trim() ||
      this.selectedCategoryId() !== null ||
      this.sortKey() !== 'newest';
  }
}
