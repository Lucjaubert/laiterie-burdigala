import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductData } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsInCartSubject: BehaviorSubject<ProductData[]> = new BehaviorSubject<ProductData[]>([]);
  private itemsInCart: ProductData[] = [];

  constructor() {
    this.itemsInCartSubject.subscribe((items) => {
      this.itemsInCart = items;
    });
  }

  public addToCart(item: ProductData): void {
    const defaultQuantity = Number(item.acf_fields.default_quantity ?? 1);

    const existingItem = this.itemsInCart.find(
      (cartItem) => cartItem.acf_fields.product_title === item.acf_fields.product_title
    );

    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity ?? 0) + defaultQuantity;
    } else {
      const cartItem = {
        ...item,
        quantity: defaultQuantity
      };
      this.itemsInCart.push(cartItem);
    }

    this.itemsInCartSubject.next([...this.itemsInCart]);
  }

  public getItems(): Observable<ProductData[]> {
    return this.itemsInCartSubject.asObservable();
  }

  public getTotalItemCount(): Observable<number> {
    return this.itemsInCartSubject.asObservable().pipe(
      map((items) =>
        items.reduce((total, item) => total + Number(item.quantity ?? 0), 0)
      )
    );
  }

  public clearCart(): void {
    this.itemsInCart = [];
    this.itemsInCartSubject.next([]);
  }

  public getTotalPrice(): number {
    return this.itemsInCart.reduce(
      (total, item) => total + this.parsePrice(item.acf_fields.price) * Number(item.quantity ?? 0),
      0
    );
  }

  private parsePrice(value: string): number {
    if (!value) return 0;
    value = value.trim().replace(',', '.');
    const floatVal = parseFloat(value);
    return isNaN(floatVal) ? 0 : floatVal;
  }
}
