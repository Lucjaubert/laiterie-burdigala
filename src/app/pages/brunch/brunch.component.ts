import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';

interface BrunchData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    texte: string;
  };
}

@Component({
  selector: 'app-brunch',
  templateUrl: './brunch.component.html',
  styleUrls: ['./brunch.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class BrunchComponent implements OnInit {

  brunchData$: Observable<BrunchData[] | null>;

   pressLogos = [
    { img: 'assets/press-logos/france-bleu-logo.png', url: 'https://www.radiofrance.fr/francebleu/podcasts/circuits-courts-en-gironde/la-burrata-100-bordeaux-4827655' },
    { img: 'assets/press-logos/le-bonbon-logo.png', url: 'https://www.lebonbon.fr/bordeaux/les-tops-food-et-drink/burdigala-la-premiere-laiterie-urbaine-bio-s-est-installee-aux-capus/' },
    { img: 'assets/press-logos/france-week-end-logo.png', url: 'https://franceweek-end.com/etablissements/la-douceur-italienne-au-coeur-de-bordeaux-laiterie-burdigala/' },
    { img: 'assets/press-logos/qfabx-logo.png', url: 'https://quoifaireabordeaux.com/blog/burdigala-la-premiere-laiterie-de-bordeaux-fabrique-sa-mozzarella-sur-place/' },
  ];

  constructor(private wpService: WordpressService) { 
    this.brunchData$ = this.wpService.getBrunchs().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page brunch:', error);
        return of(null); 
      })
    );
    
    this.brunchData$.subscribe(data => console.log('Données de la page brunch:', data));
  }

  ngOnInit(): void {
  }

}
