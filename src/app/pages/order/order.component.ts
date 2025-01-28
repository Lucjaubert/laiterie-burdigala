import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface OpeningHours {
  dayOfWeek: number;
  dayName: string;
  openingTime?: string;
  closingTime?: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule
  ]
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

  openingHours: OpeningHours[] = [
    { dayOfWeek: 1, dayName: 'Lundi' },
    { dayOfWeek: 2, dayName: 'Mardi', openingTime: '09:00', closingTime: '19:00' },
    { dayOfWeek: 3, dayName: 'Mercredi', openingTime: '09:00', closingTime: '19:00' },
    { dayOfWeek: 4, dayName: 'Jeudi', openingTime: '09:00', closingTime: '19:00' },
    { dayOfWeek: 5, dayName: 'Vendredi', openingTime: '09:00', closingTime: '19:00' },
    { dayOfWeek: 6, dayName: 'Samedi', openingTime: '09:00', closingTime: '15:00' },
    { dayOfWeek: 0, dayName: 'Dimanche', openingTime: '10:00', closingTime: '15:00' },
  ];

  availablePickupTimes: string[] = [];

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

  myFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const dayOfWeek = d.getDay();
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    if (d < today || d > maxDate) {
      return false;
    }
    const openingHour = this.openingHours.find(o => o.dayOfWeek === dayOfWeek);
    return !!(openingHour && openingHour.openingTime);
  };

  onPickupDayChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    this.customerInfo.pickupDay = selectedDate;
    this.generateAvailablePickupTimes(selectedDate);
  }

  generateAvailablePickupTimes(selectedDate: Date | null): void {
    if (!selectedDate) {
      this.availablePickupTimes = [];
      return;
    }
    const dayOfWeek = selectedDate.getDay();
    const openingHour = this.openingHours.find(o => o.dayOfWeek === dayOfWeek);
    if (openingHour && openingHour.openingTime && openingHour.closingTime) {
      const openingTime: string = openingHour.openingTime;
      const closingTime: string = openingHour.closingTime;
      const times: string[] = [];
      let startTime: number = this.parseTime(openingTime);
      const endTime: number = this.parseTime(closingTime);
      const adjustedEndTime = endTime - 30;
      while (startTime <= adjustedEndTime) {
        times.push(this.formatTime(startTime));
        startTime += 30;
      }
      this.availablePickupTimes = times;
    } else {
      this.availablePickupTimes = [];
    }
  }

  parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.padZero(hours)}:${this.padZero(mins)}`;
  }

  padZero(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  parseToFloat(value: string): number {
    if (!value) return 0;
    value = value.trim().replace(',', '.');
    const floatVal = parseFloat(value);
    return isNaN(floatVal) ? 0 : floatVal;
  }

  getTotalPriceTTC(): number {
    return this.items.reduce((acc, item) => {
      const priceTTC = this.parseToFloat(item.acf_fields.price);
      return acc + (priceTTC * (item.quantity ?? 0));
    }, 0);
  }

  getTotalPriceHT(): number {
    return this.items.reduce((acc, item) => {
      const priceTTC = this.parseToFloat(item.acf_fields.price);
      const priceHT = priceTTC / 1.055;
      return acc + (priceHT * (item.quantity ?? 0));
    }, 0);
  }

  calculateTVA(): number {
    return this.getTotalPriceTTC() - this.getTotalPriceHT();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  submitOrder() {
    if (!this.customerInfo.firstName || !this.customerInfo.lastName ||
        !this.customerInfo.email || !this.customerInfo.pickupDay || !this.customerInfo.pickupTime) {
      this.snackBar.open('Veuillez remplir tous les champs requis.', 'Merci', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    const orderDetails = {
      customerInfo: {
        ...this.customerInfo,
        pickupDay: (this.customerInfo.pickupDay as Date).toLocaleDateString('fr-FR'),
        pickupTime: this.customerInfo.pickupTime
      },
      items: this.items.map(item => ({
        title: item.acf_fields.product_title,
        quantity: item.quantity,
        price: item.acf_fields.price
      }))
    };

    this.http.post('https://laiterieburdigala.fr/wp-json/laiterie-burdigala/v1/send-order', orderDetails).subscribe({
      next: () => {
        this.snackBar.open('Votre commande a été envoyée avec succès', 'Merci', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
        this.clearCart();
      },
      error: () => {
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
