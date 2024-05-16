import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FormsModule } from '@angular/forms';

interface ProductData {
  acf_fields: {
    product_title: string;
    product_image: string;
    description: string;
    price: string;
    weight: string;
    default_quantity: number;
    product_category: string;
  }
}

interface PageContent {
  acf_fields: {
    title: string;
    title_2: string;
    subtitle: string;
  }
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
})
export class ProductsComponent implements OnInit {
  isHomepage = false;

  productsData$: Observable<ProductData[] | null>;
  pageContent$: Observable<PageContent | null>;

  constructor(private wpService: WordpressService) {
    this.pageContent$ = this.wpService.getPageContent().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page:', error);
        return of(null);
      })
    );

    this.productsData$ = this.wpService.getProducts().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des produits:', error);
        return of(null);
      })
    );
  }

  ngOnInit(): void {}

  decreaseQuantity(product: ProductData): void {
    if (product.acf_fields.default_quantity > 1) {
      product.acf_fields.default_quantity--;
    }
  }

  increaseQuantity(product: ProductData): void {
    product.acf_fields.default_quantity++;
  }

  addToOrder(product: ProductData): void {
    // Logique pour ajouter le produit à la commande
    console.log('Ajouter à la commande:', product);
  }
}
