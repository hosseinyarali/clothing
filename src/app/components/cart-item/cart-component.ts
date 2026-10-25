import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart = inject(CartService);

  // سبد وقتی معتبره که حداقل یه آیتم داشته باشه
  // و هیچ آیتمی از موجودی بیشتر نباشه
  canCheckout = computed(() => {
    const items = this.cart.items();
    if (items.length === 0) return false;
    return items.every(i => i.quantity > 0 && i.quantity <= i.maxStock);
  });
}
