import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';

interface BrunchData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    subtitle: string;
    texte: string;
    'image-1': string;
    'image-2': string;
    'image-3': string;
    'image-4': string;
    'image-5': string;
    'image-6': string;
    'image-7': string;
  };
}

@Component({
  selector: 'app-brunch',
  templateUrl: './brunch.component.html',
  styleUrls: ['./brunch.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class BrunchComponent implements OnInit {
  brunchData$: Observable<BrunchData[] | null>;

  constructor(private wpService: WordpressService) {
    this.brunchData$ = this.wpService.getBrunchs().pipe(
      catchError(error => {
        console.error('Error retrieving brunch page data:', error);
        return of(null); 
      })
    );
  }

  ngOnInit(): void {
  }

  callLaiterie(): void {
    window.location.href = 'tel:+33665492642';
  }
}
