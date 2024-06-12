import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  screenWidth: number;

  constructor(private wpService: WordpressService, private cdRef: ChangeDetectorRef) {
    this.brunchData$ = this.wpService.getBrunchs().pipe(
      catchError(error => {
        console.error('Error retrieving brunch page data:', error);
        return of(null);
      })
    );
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.updateScreenWidth();
  }

  @HostListener('window:resize')
  updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
    this.cdRef.detectChanges(); 
  }

  getImageWidth(): string {
    if (this.screenWidth < 768) {
      return '100%'; 
    } else if (this.screenWidth >= 768 && this.screenWidth <= 1024) {
      return '400px'; 
    } else {
      return '400px'; 
    }
  }
  
  getImageHeight(): string {
    if (this.screenWidth < 768) {
      return 'auto';
    } else if (this.screenWidth >= 768 && this.screenWidth <= 1024) {
      return '300px';
    } else {
      return '550px'; 
    }
  }  

  callLaiterie(): void {
    window.location.href = 'tel:+33665492642';
  }
}