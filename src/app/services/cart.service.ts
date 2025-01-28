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
    const existingItem = this.itemsInCart.find(
      (cartItem) => cartItem.acf_fields.product_title === item.acf_fields.product_title
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity ?? 0) + (item.acf_fields.default_quantity ?? 1);
    } else {
      const cartItem = { ...item, quantity: item.acf_fields.default_quantity ?? 1 };
      this.itemsInCart.push(cartItem);
    }
    this.itemsInCartSubject.next([...this.itemsInCart]);
  }

  public getItems(): Observable<ProductData[]> {
    return this.itemsInCartSubject.asObservable();
  }

  public getTotalItemCount(): Observable<number> {
    return this.itemsInCartSubject.asObservable().pipe(
      map((items) => items.reduce((total, item) => total + (item.quantity ?? 0), 0))
    );
  }

  public clearCart(): void {
    this.itemsInCart = [];
    this.itemsInCartSubject.next([]);
  }

  // Méthode qui calcule le total TTC en convertissant la virgule en point.
  public getTotalPrice(): number {
    return this.itemsInCart.reduce(
      (total, item) => total + this.parsePrice(item.acf_fields.price) * (item.quantity ?? 0),
      0
    );
  }

  // Conversion "6,5" => "6.5"
  private parsePrice(value: string): number {
    if (!value) return 0;
    value = value.trim().replace(',', '.');
    const floatVal = parseFloat(value);
    return isNaN(floatVal) ? 0 : floatVal;
  }
}
