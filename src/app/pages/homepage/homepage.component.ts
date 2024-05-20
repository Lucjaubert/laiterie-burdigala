import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WordpressService } from 'src/app/services/wordpress.service'; 
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MenuBurgerLogoComponent } from '../../shared/components/menu-burger-logo/menu-burger-logo.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { gsap } from 'gsap';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true, 
  imports: [CommonModule, RouterModule, HeaderComponent, MenuBurgerLogoComponent, CarouselModule],
})
export class HomepageComponent implements OnInit {
  isHomepage = true;
  initialOpacity: number = 0;  
  homepageData$: Observable<any | null>;
  preparedSlogan: SafeHtml = '';

  opinions = [
    { img: 'assets/opinions/avis-1.png' },
    { img: 'assets/opinions/avis-2.png' },
    { img: 'assets/opinions/avis-3.png' },
    { img: 'assets/opinions/avis-4.png' },
    { img: 'assets/opinions/avis-5.png' },
    { img: 'assets/opinions/avis-6.png' },
    { img: 'assets/opinions/avis-7.png' },
    { img: 'assets/opinions/avis-8.png' },
  ];

  pressLogos = [
    { img: 'assets/press-logos/france-week-end.png', url: 'https://franceweek-end.com/etablissements/la-douceur-italienne-au-coeur-de-bordeaux-laiterie-burdigala/' },
    { img: 'assets/press-logos/le-bonbon-vector-logo.png', url: 'https://www.lebonbon.fr/bordeaux/les-tops-food-et-drink/burdigala-la-premiere-laiterie-urbaine-bio-s-est-installee-aux-capus/' },
    { img: 'assets/press-logos/france-bleu.png', url: 'https://www.radiofrance.fr/francebleu/podcasts/circuits-courts-en-gironde/la-burrata-100-bordeaux-4827655' },
    { img: 'assets/press-logos/quoi-faire-a-bx.jpg', url: 'https://quoifaireabordeaux.com/blog/burdigala-la-premiere-laiterie-de-bordeaux-fabrique-sa-mozzarella-sur-place/' },
  ];
  
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
        duration: 4,
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
