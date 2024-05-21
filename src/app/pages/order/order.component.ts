import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WordpressService } from 'src/app/services/wordpress.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class OrderComponent implements OnInit {

  orderItems$: Observable<ProductData[]>;

  constructor(private wpService: WordpressService, private cartService: CartService) {
    this.orderItems$ = this.cartService.getItems(); 
  }

  ngOnInit(): void {
  }
}
