import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // برای تأیید حذف
  deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('خطا:', err);
        this.error.set('خطا در بارگذاری دسته‌بندی‌ها.');
        this.loading.set(false);
      }
    });
  }

  confirmDelete(id: number) {
    this.deletingId.set(id);
  }

  cancelDelete() {
    this.deletingId.set(null);
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== id));
        this.deletingId.set(null);
      },
      error: (err) => {
        console.error('خطای حذف:', err);
        this.error.set(err?.error?.message ?? 'خطا در حذف دسته‌بندی.');
        this.deletingId.set(null);
      }
    });
  }
}
