import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {CategoryService} from "../../services/category.service";
import {AdminProductService} from "../service/AdminProductService";
import {Category} from "../../models/category.model";


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(AdminProductService);
  private catService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  saving = signal(false);
  submitted = signal(false);
  error = signal<string | null>(null);
  ok = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    basePrice: [null as number | null, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, [Validators.required]],
    imageUrl: ['', [Validators.maxLength(500)]],
    variants: this.fb.array<FormGroup>([]),
  });

  get variants(): FormArray<FormGroup> {
    return this.form.get('variants') as FormArray<FormGroup>;
  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.catService.getAll().subscribe({
      next: (list) => {
        this.categories.set(list);
        console.log('📦 categories loaded:', list.length, list);
      },
      error: (err) => {
        console.error('❌ categories load error:', err);
        this.error.set('خطا در دریافت دسته‌بندی‌ها');
      },
    });
    this.addVariant();
  }

  createVariantGroup(): FormGroup {
    return this.fb.group({
      size: ['', [Validators.required, Validators.maxLength(10)]],
      color: ['', [Validators.required, Validators.maxLength(30)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      price: [null as number | null],
      sku: ['', [Validators.maxLength(50)]],
    });
  }

  addVariant(): void {
    this.variants.push(this.createVariantGroup());
  }

  removeVariant(i: number): void {
    if (this.variants.length > 1) this.variants.removeAt(i);
  }

  submit(): void {
    this.submitted.set(true);
    this.error.set(null);
    this.ok.set(null);

    console.log('=== SUBMIT CALLED ===');
    console.log('form.valid:', this.form.valid);
    console.log('form.value:', this.form.getRawValue());
    console.log('variants.length:', this.variants.length);

    if (this.form.invalid) {
      console.log('❌ INVALID — دلایل:');
      Object.keys(this.form.controls).forEach(k => {
        const c = this.form.get(k);
        if (c?.invalid) {
          console.log(`   ⛔ ${k}:`, JSON.stringify(c.errors), '| value =', JSON.stringify(c.value));
        }
      });
      this.variants.controls.forEach((g, i) => {
        if (g.invalid) {
          console.log(`   ⛔ variant[${i}]:`, g.value);
          Object.keys((g as FormGroup).controls).forEach(k => {
            const c = (g as FormGroup).get(k);
            if (c?.invalid) {
              console.log(`       ↳ ${k}:`, JSON.stringify(c.errors), '| value =', JSON.stringify(c.value));
            }
          });
        }
      });
      this.form.markAllAsTouched();
      return;
    }

    console.log('✅ form valid — آماده ارسال به API');

    this.saving.set(true);
    const raw = this.form.getRawValue();

    const payload = {
      name: raw.name!.trim(),
      description: raw.description?.trim() || null,
      basePrice: raw.basePrice!,
      categoryId: raw.categoryId!,
      imageUrl: raw.imageUrl?.trim() || null,
      variants: this.variants.controls.map(g => {
        const v = g.getRawValue();
        return {
          size: v.size.trim(),
          color: v.color.trim(),
          stockQuantity: v.stockQuantity ?? 0,
          price: v.price ?? null,
          sku: v.sku?.trim() || null,
        };
      }),
    };

    console.log('🚀 POST /api/admin/products payload:', payload);

    this.api.create(payload).subscribe({
      next: (res) => {
        console.log('✅ API success:', res);
        this.saving.set(false);
        this.ok.set(`محصول «${res.name}» با موفقیت ذخیره شد ✅`);

        this.form.reset({
          name: '',
          description: '',
          basePrice: null,
          categoryId: null,
          imageUrl: '',
        });
        while (this.variants.length > 0) this.variants.removeAt(0);
        this.addVariant();
        this.submitted.set(false);
      },
      error: (err) => {
        console.error('❌ API error:', err);
        console.error('   status:', err?.status);
        console.error('   body:', err?.error);
        this.saving.set(false);
        this.error.set(
          err?.error?.message ??
          err?.error?.error ??
          `خطا در ذخیره محصول (${err?.status ?? '?'})`
        );
      },
    });
  }
}
