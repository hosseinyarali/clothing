import { Injectable, computed, signal } from '@angular/core';
import {CartItem} from "../models/cart.item.model";

const STORAGE_KEY = 'cart_items';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly total = computed(() =>
    this._items().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  // ---------- ذخیره‌سازی ----------

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // مثلاً وقتی حجم localStorage پر باشه — بی‌صدا رد شو
    }
  }

  private setItems(items: CartItem[]) {
    this._items.set(items);
    this.persist(items);
  }

  // ---------- عملیات ----------

  add(item: CartItem) {
    const items = this._items();
    const idx = items.findIndex(i => i.variantId === item.variantId);

    if (idx === -1) {
      this.setItems([
        ...items,
        { ...item, quantity: Math.max(1, Math.min(item.quantity, item.maxStock)) }
      ]);
      return;
    }

    const existing = items[idx];
    const newQty = Math.min(existing.quantity + item.quantity, existing.maxStock);
    const updated = [...items];
    updated[idx] = { ...existing, quantity: newQty };
    this.setItems(updated);
  }

  updateQuantity(variantId: number, quantity: number) {
    const updated = this._items().map(i =>
      i.variantId === variantId
        ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
        : i
    );
    this.setItems(updated);
  }

  remove(variantId: number) {
    this.setItems(this._items().filter(i => i.variantId !== variantId));
  }

  clear() {
    this.setItems([]);
  }
}
