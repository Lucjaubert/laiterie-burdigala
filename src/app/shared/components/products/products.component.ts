import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

interface ProductsData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    subtitle: string;
    product_title: string;
    product_image: boolean;
    description: string;
    price: string;
    weight: string;
    default_quantity: string;
  };
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true, 
  imports: [CommonModule, HeaderComponent, RouterModule],
})
export class ProductsComponent implements OnInit {
  isHomepage = false;

  productsData$: Observable<ProductsData[] | null>;

  constructor(private wpService: WordpressService) { 
    this.productsData$ = this.wpService.getProducts().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page produits:', error);
        return of(null); 
      })
    );
    
    this.productsData$.subscribe(data => console.log('Données de la page produits:', data));
  }

  ngOnInit(): void {
  }
}
