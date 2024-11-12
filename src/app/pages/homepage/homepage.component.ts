import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { WordpressService } from 'src/app/services/wordpress.service'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true, 
  imports: [
    CommonModule,   
    CarouselModule
  ],
})
export class HomepageComponent implements OnInit {
  isHomepage = true;
  initialOpacity: number = 0;  
  homepageData: any = null;
  preparedSlogan: SafeHtml = '';

  opinions = [
    { img: 'assets/opinions/avis-2.png' },
    { img: 'assets/opinions/avis-3.png' },
    { img: 'assets/opinions/avis-4.png' },
    { img: 'assets/opinions/avis-5.png' },
    { img: 'assets/opinions/avis-6.png' },
    { img: 'assets/opinions/avis-7.png' },
    { img: 'assets/opinions/avis-8.png' },
  ];

  pressLogos = [
    { img: 'assets/press-logos/france-bleu-logo.png', url: 'https://www.radiofrance.fr/francebleu/podcasts/circuits-courts-en-gironde/la-burrata-100-bordeaux-4827655' },
    { img: 'assets/press-logos/le-bonbon-logo.png', url: 'https://www.lebonbon.fr/bordeaux/les-tops-food-et-drink/burdigala-la-premiere-laiterie-urbaine-bio-s-est-installee-aux-capus/' },
    { img: 'assets/press-logos/france-week-end-logo.png', url: 'https://franceweek-end.com/etablissements/la-douceur-italienne-au-coeur-de-bordeaux-laiterie-burdigala/' },
    { img: 'assets/press-logos/qfabx-logo.png', url: 'https://quoifaireabordeaux.com/blog/burdigala-la-premiere-laiterie-de-bordeaux-fabrique-sa-mozzarella-sur-place/' },
  ];
  
  constructor(
    private wpService: WordpressService, 
    private sanitizer: DomSanitizer, 
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log(this.pressLogos); 
    this.wpService.getHomepage().subscribe(
      (data) => {
        console.log('Données reçues de l\'API :', data);
        if (data && data.length > 0) {
          this.homepageData = data[0];
          this.preparedSlogan = this.prepareSlogan(this.homepageData.acf_fields.slogan);
          this.cdRef.detectChanges();  
          this.animateSlogan();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de la page d\'accueil:', error);
      }
    );
  }
  

  animateSlogan(): void {
    this.initialOpacity = 1;  
    const sloganElement = document.querySelector('.slogan');
    if (sloganElement) {
      gsap.fromTo(sloganElement, { y: 30, opacity: 0 }, {
        duration: 6,
        y: 0,
        opacity: 1,
        ease: 'power4.out'
      });
    }
  }

  prepareSlogan(slogan: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(slogan);
  }
}
