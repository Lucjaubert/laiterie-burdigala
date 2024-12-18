import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { ProductData } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface CategoryGroup {
  category: string;
  products: ProductData[];
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule, RouterModule, MatIconModule ],
})
export class ProductsComponent implements OnInit {
  isHomepage = false;
  productsData$: Observable<ProductData[] | null>;
  productsByCategory$: Observable<CategoryGroup[]>;

  constructor(private wpService: WordpressService, private cartService: CartService) {
    this.productsData$ = this.wpService.getProducts().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des produits:', error);
        return of(null);
      })
    );

    this.productsByCategory$ = this.productsData$.pipe(
      map(products => {
        return this.groupProductsByCategory(products);
      })
    );
  }

  ngOnInit(): void {}

  private groupProductsByCategory(products: ProductData[] | null): CategoryGroup[] {
    if (!products) {
      return [];
    }

    const categoryGroups: { [key: string]: ProductData[] } = {};
    products.forEach(product => {
      if (product.acf_fields.product_category && product.acf_fields.product_category.length > 0) {
        product.acf_fields.product_category.forEach(category => {
          if (!categoryGroups[category.name]) {
            categoryGroups[category.name] = [];
          }
          categoryGroups[category.name].push(product);
        });
      } else {
        console.log('Produit sans catégories :', product);
      }
    });

    Object.keys(categoryGroups).forEach(key => {
      categoryGroups[key] = categoryGroups[key].reverse();
    });

    return Object.keys(categoryGroups).map(key => ({
      category: key,
      products: categoryGroups[key]
    })).reverse();
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
    this.cartService.addToCart(product);
  }
}
