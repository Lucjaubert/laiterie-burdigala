import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
interface CategoryGroup {
  category: string;
  products: ProductData[];
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
  productsByCategory$: Observable<CategoryGroup[]>;

  constructor(private wpService: WordpressService) {
    this.productsData$ = this.wpService.getProducts().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des produits:', error);
        return of(null); // Fallback to null in case of error
      })
    );

    this.productsByCategory$ = this.productsData$.pipe(
      map(products => this.groupProductsByCategory(products))
    );
  }

  ngOnInit(): void {}

  private groupProductsByCategory(products: ProductData[] | null): CategoryGroup[] {
    const categoryGroups: { [key: string]: ProductData[] } = {};
    products?.forEach(product => {
      const category = product.acf_fields.product_category || 'Other';
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(product);
    });
    return Object.keys(categoryGroups).map(key => ({
      category: key,
      products: categoryGroups[key]
    }));
  }

  decreaseQuantity(product: ProductData): void {
    if (product.acf_fields.default_quantity > 1) {
      product.acf_fields.default_quantity--;
    }
  }

  increaseQuantity(product: ProductData): void {
    product.acf_fields.default_quantity++;
  }

  addToOrder(product: ProductData): void {
    console.log('Ajouter à la commande:', product);
  }
}