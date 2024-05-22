import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OrderComponent implements OnInit {
  orderItems$: Observable<ProductData[]>;

  constructor(private cartService: CartService) {
    this.orderItems$ = this.cartService.getItems();
  }

  ngOnInit(): void {}

  getTotalPrice(items: ProductData[]): number {
    return items.reduce((total, item) => total + (parseFloat(item.acf_fields.price) * (item.quantity ?? 1)), 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
