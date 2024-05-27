import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  customerInfo: any = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    pickupDay: '',
    pickupTime: ''
  };

  constructor(private cartService: CartService, private http: HttpClient) {
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

  submitOrder() {
    const orderDetails = {
      customerInfo: this.customerInfo,
      items: this.items.map(item => ({
        title: item.acf_fields.product_title,
        quantity: item.quantity,
        price: item.acf_fields.price
      }))
    };

    this.http.post('https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1/send-order', orderDetails).subscribe({
      next: response => console.log('Order sent successfully', response),
      error: error => console.error('Failed to send order', error)
    });
  }
}
