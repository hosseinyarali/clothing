import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminCategoryService } from '../../service/AdminCategoryService';
import {AdminCategory} from "../../dto/AdminCategory";

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-category-list.component.html',
  styleUrls: ['./admin-category-list.component.css'],
})
export class AdminCategoryListComponent implements OnInit {
  private categoryService = inject(AdminCategoryService);

  categories = signal<AdminCategory[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  search = signal('');

  // فرم افزودن / ویرایش
  formName = signal('');
  editingId = signal<number | null>(null);
  saving = signal(false);
  formError = signal<string | null>(null);

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q
      ? this.categories().filter(c => c.name.toLowerCase().includes(q))
      : this.categories();
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getAll().subscribe({
      next: data => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('خطا در دریافت دسته‌بندی‌ها');
        this.loading.set(false);
      },
    });
  }

  startEdit(c: AdminCategory) {
    this.editingId.set(c.id);
    this.formName.set(c.name);
    this.formError.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.formName.set('');
    this.formError.set(null);
  }

  save() {
    const name = this.formName().trim();
    if (!name) {
      this.formError.set('نام دسته‌بندی الزامی است');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    const id = this.editingId();

    if (id === null) {
      this.categoryService.create({ name }).subscribe({
        next: created => {
          this.categories.update(list => [...list, created]);
          this.afterSave();
        },
        error: err => this.onSaveError(err),
      });
    } else {
      this.categoryService.update(id, { name }).subscribe({
        next: updated => {
          this.categories.update(list => list.map(c => (c.id === updated.id ? updated : c)));
          this.afterSave();
        },
        error: err => this.onSaveError(err),
      });
    }
  }

  remove(c: AdminCategory) {
    if (!confirm(`دسته‌بندی «${c.name}» حذف شود؟`)) return;
    this.categoryService.delete(c.id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(x => x.id !== c.id));
        if (this.editingId() === c.id) this.cancelEdit();
      },
      error: (err: HttpErrorResponse) => {
        alert(
          err.status === 409
            ? 'این دسته‌بندی محصول دارد و قابل حذف نیست'
            : 'حذف دسته‌بندی ناموفق بود'
        );
      },
    });
  }

  private afterSave() {
    this.saving.set(false);
    this.cancelEdit();
  }

  private onSaveError(err: HttpErrorResponse) {
    this.saving.set(false);
    this.formError.set(
      err.status === 409 ? 'این نام قبلاً استفاده شده است' : 'ذخیره دسته‌بندی ناموفق بود'
    );
  }
}
