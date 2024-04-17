import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordpressService } from 'src/app/services/wordpress.service'; 
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true, 
  imports: [CommonModule, HeaderComponent, MenuBurgerLogoComponent],
})
export class HomepageComponent implements OnInit {
  initialOpacity: number = 0;  
  homepageData$: Observable<any | null>;
  preparedSlogan: SafeHtml = '';

  constructor(private wpService: WordpressService, private sanitizer: DomSanitizer) { 
    this.homepageData$ = this.wpService.getHomepage().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page daccueil:', error);
        return of(null); 
      })
    );
  }

  ngOnInit(): void {
    this.homepageData$.subscribe((data) => {
      if (data && data.length > 0) {
        this.preparedSlogan = this.prepareSlogan(data[0].acf_fields.slogan);
        setTimeout(() => this.animateSlogan(), 100);
      }
    });
  }

  animateSlogan(): void {
    this.initialOpacity = 1;  
    const sloganElement = document.querySelector('.slogan');
    if (sloganElement) {
      gsap.fromTo(sloganElement, { y: 30, opacity: 0 }, {
        duration: 2,
        y: 0,
        opacity: 1.5,
        ease: 'power4.out'
      });
    }
  }

  prepareSlogan(slogan: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(slogan);
  }

  safeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

