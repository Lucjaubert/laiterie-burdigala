import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface privacyLegacyData {
  title: string;
  acf_fields: {
    title: string;
    content: string;
  };
}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class PrivacyPolicyComponent implements OnInit {
  isHomepage = false;
  privacyLegacyData$: Observable<privacyLegacyData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.privacyLegacyData$ = this.wpService.getPrivacyPolicy().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}
