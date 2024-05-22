import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsInCartSubject: BehaviorSubject<ProductData[]> = new BehaviorSubject<ProductData[]>([]);
  private itemsInCart: ProductData[] = [];

  constructor() {
    this.itemsInCartSubject.subscribe(_ => this.itemsInCart = _);
  }

  public addToCart(item: ProductData): void {
    const existingItem = this.itemsInCart.find(cartItem => cartItem.acf_fields.product_title === item.acf_fields.product_title);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity ?? 0) + item.acf_fields.default_quantity;
    } else {
      const cartItem = { ...item, quantity: item.acf_fields.default_quantity }; 
      this.itemsInCart.push(cartItem);
    }
    this.itemsInCartSubject.next(this.itemsInCart);
  }

  public getItems(): Observable<ProductData[]> {
    return this.itemsInCartSubject.asObservable();
  }

  public clearCart(): void {
    this.itemsInCart = [];
    this.itemsInCartSubject.next(this.itemsInCart);
  }
}
