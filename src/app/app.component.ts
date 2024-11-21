import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransitionComponent } from './shared/components/transition/transition.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    HeaderComponent,
    TransitionComponent,
    MatSnackBarModule,
    MatButtonModule,
  ],
})
export class AppComponent {
  title = 'laiterie-burdigala';
  showTransition: boolean = false;
  isHomepage: boolean = false;
  isIntroPage: boolean = false;
  showFooter: boolean = true;
  isNotFoundPage: boolean = false;

  constructor(private router: Router, private titleService: Title, private metaService: Meta) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      console.log("Current URL:", router.url);
      this.updatePageFlags();
      this.updateSEO();
    });
  }

  toggleTransition(): void {
    this.showTransition = !this.showTransition;
  }

  private updatePageFlags(): void {
    this.isHomepage = this.router.url === '/' || this.router.url.startsWith('/accueil');
    this.isIntroPage = this.router.url === '/';
    this.showFooter = !(this.router.url === '/' || this.router.url === '/accueil');
  }

  private updateSEO(): void {
    if (this.router.url === '/accueil') {
      this.setSEO(
        'Accueil - Laiterie Burdigala',
        'Bienvenue à la Laiterie Burdigala, votre fournisseur de produits laitiers artisanaux à Bordeaux.',
        'https://laiterie-burdigala.fr/assets/img/home-banner.webp'
      );
    } else if (this.router.url === '/contact') {
      this.setSEO(
        'Contact - Laiterie Burdigala',
        'Contactez la Laiterie Burdigala pour découvrir nos produits laitiers artisanaux ou obtenir plus d’informations.',
        'https://laiterie-burdigala.fr/assets/img/contact-banner.webp'
      );
    } else if (this.router.url === '/404') {
      this.setSEO(
        'Erreur 404 - Page non trouvée | Laiterie Burdigala',
        'La page que vous cherchez est introuvable. Retournez à l’accueil ou contactez-nous.',
        'https://laiterie-burdigala.fr/assets/img/404-banner.webp'
      );
    } else {
      this.setSEO(
        'Laiterie Burdigala - Produits laitiers artisanaux à Bordeaux',
        'Découvrez les meilleurs produits laitiers de Bordeaux chez Laiterie Burdigala. Qualité, tradition et saveurs authentiques.',
        'https://laiterie-burdigala.fr/assets/img/logo-laiterie-burdigala.webp'
      );
    }
  }

  /**
   * Met à jour les balises meta pour le SEO.
   * @param title
   * @param description
   * @param image
   */
  private setSEO(title: string, description: string, image: string): void {

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: 'https://laiterie-burdigala.fr' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }
}
