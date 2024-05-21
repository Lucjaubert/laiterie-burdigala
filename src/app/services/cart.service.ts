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
    this.itemsInCart.push(item);
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
