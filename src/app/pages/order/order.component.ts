import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importations Angular Material
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface OpeningHours {
  dayOfWeek: number; // 0 pour Dimanche, 1 pour Lundi, etc.
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
    { dayOfWeek: 1, dayName: 'Lundi' }, // Fermé
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

  // Méthode pour filtrer les dates disponibles dans le DatePicker
  myFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const dayOfWeek = d.getDay();
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14); // Limiter à 14 jours à partir d'aujourd'hui

    // Vérifier que la date est dans la plage autorisée
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

      // Générer des créneaux horaires toutes les 30 minutes
      const times: string[] = [];
      let startTime: number = this.parseTime(openingTime);
      const endTime: number = this.parseTime(closingTime);

      // Soustraire 30 minutes pour s'assurer que le dernier créneau est avant l'heure de fermeture
      const adjustedEndTime = endTime - 30;

      while (startTime <= adjustedEndTime) {
        times.push(this.formatTime(startTime));
        startTime += 30; // Ajouter 30 minutes
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
    if (!this.customerInfo.firstName || !this.customerInfo.lastName || !this.customerInfo.email || !this.customerInfo.pickupDay || !this.customerInfo.pickupTime) {
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
      next: (response) => {
        this.snackBar.open('Votre commande a été envoyée avec succès', 'Merci', {
          duration: 3000,
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
