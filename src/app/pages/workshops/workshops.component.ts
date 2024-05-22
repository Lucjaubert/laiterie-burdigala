import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface WorkshopData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    texte: string;
  };
}

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
})
export class WorkshopsComponent implements OnInit {
  isHomepage = false;

  workshopsData$: Observable<WorkshopData[] | null>;

  constructor(private wpService: WordpressService) { 
    this.workshopsData$ = this.wpService.getWorkshop().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
    
    this.workshopsData$.subscribe(data => console.log('Données de la page ateliers:', data));
  }

  ngOnInit(): void {
  }

}
