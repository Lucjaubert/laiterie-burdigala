import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class OrderComponent implements OnInit {
  orderItems$: Observable<ProductData[]>;
  items: ProductData[] = [];

  constructor(private cartService: CartService) {
    this.orderItems$ = this.cartService.getItems();
  }

  ngOnInit(): void {
    this.orderItems$.subscribe(items => this.items = items);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (parseFloat(item.acf_fields.price) * (item.quantity ?? 0)), 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  parseToFloat(value: string): number {
    return parseFloat(value);
  }
}
