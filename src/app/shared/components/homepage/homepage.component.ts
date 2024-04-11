import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from 'src/app/scripts/wordpress.service'; 
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

interface HomepageData {
  title: string;
  content: string;
  acf_fields: {
    slogan: string;
    avis: string;
    presse: string;
    location: string;
    gegege: string;
  };
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true, 
  imports: [CommonModule],
})
export class HomepageComponent implements OnInit {
  homepageData$: Observable<HomepageData[] | null>;

  constructor(private wpService: WordpressService) { 
    this.homepageData$ = this.wpService.getHomepage().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page daccueil:', error);
        return of(null); 
      })
    );
    
    // Ajout d'un console.log pour vérifier les données
    this.homepageData$.subscribe(data => console.log('Données de la page daccueil:', data));
  }

  ngOnInit(): void {
  }
}
