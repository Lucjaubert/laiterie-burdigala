import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/scripts/wordpress.service';

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
  imports: [CommonModule],
})
export class BrunchComponent implements OnInit {

  brunchData$: Observable<BrunchData[] | null>;

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
