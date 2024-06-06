import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface termsConditionsData {
  title: string;
  acf_fields: {
    title: string;
    content: string;
  };
}

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class TermsConditionsComponent implements OnInit {
  isHomepage = false;
  termsConditionsData$: Observable<termsConditionsData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.termsConditionsData$ = this.wpService.getTermsConditions().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}

