import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';

interface OrderData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    subtitle: string;
  };
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class OrderComponent implements OnInit {

  orderData$: Observable<OrderData[] | null>;

  constructor(private wpService: WordpressService) { 
    this.orderData$ = this.wpService.getOrder().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page de commande:', error);
        return of(null); 
      })
    );
    
    this.orderData$.subscribe(data => console.log('Données de la page de commande:', data));
  }

  ngOnInit(): void {
  }

}
