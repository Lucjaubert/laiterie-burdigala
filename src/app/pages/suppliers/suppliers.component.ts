import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';

interface SupplierData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    subtitle: string;
    suppliers: {
      [key: string]: string;
    };
  };
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SuppliersComponent implements OnInit {

  suppliersData$: Observable<SupplierData[] | null>;

  constructor(private wpService: WordpressService) { 
    this.suppliersData$ = this.wpService.getSuppliers().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page fournisseurs:', error);
        return of(null); 
      })
    );
    
    this.suppliersData$.subscribe(data => console.log('Données de la page fournisseurs:', data));
  }

  ngOnInit(): void {
  }

}
