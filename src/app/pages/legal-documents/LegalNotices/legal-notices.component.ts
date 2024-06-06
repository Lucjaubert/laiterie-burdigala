import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface LegalNoticesData {
  title: string;
  acf_fields: {
    title: string;
    content: string;
  };
}

@Component({
  selector: 'app-legal-notices',
  templateUrl: './legal-notices.component.html',
  styleUrls: ['./legal-notices.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class LegalNoticesComponent implements OnInit {
  isHomepage = false;
  legalNotices$: Observable<LegalNoticesData[] | null>;

  constructor(
    private wpService: WordpressService, 
  ) { 
    this.legalNotices$ = this.wpService.getLegalNotices().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page mentions-legales:', error);
        return of(null); 
      })
    );
  }

  ngOnInit() {
  }

}
