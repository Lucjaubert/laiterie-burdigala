import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private cartService: CartService, 
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.orderItems$ = this.cartService.getItems();
  }

  ngOnInit(): void {
    this.orderItems$.subscribe(items => this.items = items);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (parseFloat(item.acf_fields.price) * (item.quantity ?? 0)), 0);
  }

  getTotalPriceHT(): number {
    return this.items.reduce((total, item) => total + (parseFloat(item.acf_fields.price) * (item.quantity ?? 0)), 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  parseToFloat(value: string): number {
    return parseFloat(value);
  }

  calculateTVA(): number {
    const totalPriceHT = this.getTotalPriceHT();
    return totalPriceHT * 0.055;
  }

  submitOrder() {
    if (!this.customerInfo.firstName || !this.customerInfo.lastName || !this.customerInfo.email) {
      this.snackBar.open('Veuillez remplir tous les champs requis.', 'Merci', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    const orderDetails = {
      customerInfo: this.customerInfo,
      items: this.items.map(item => ({
        title: item.acf_fields.product_title,
        quantity: item.quantity,
        price: item.acf_fields.price
      }))
    };

    this.http.post('https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1/send-order', orderDetails).subscribe({
      next: (response) => {
        this.snackBar.open('Votre commande a été envoyée avec succès', 'merci', {
          duration: 300000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
        this.clearCart();
      },
      error: (error) => {
        this.snackBar.open('Erreur lors de l\'envoi de la commande', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
      }
    });
  }  
}
