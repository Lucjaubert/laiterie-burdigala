import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';
import { MenuStateService } from 'src/app/services/menustate.service';
import { NavigationService } from 'src/app/services/navigation.service';  // Assurez-vous que ce chemin est correct
import { TransitionService } from 'src/app/services/transition.service'; // Ajout du service de gestion des transitions
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuBurgerLogoComponent, RouterModule]
})
export class HeaderComponent {
  @Input() isHomepage: boolean = true;
  navbarExpanded: boolean = false;

  @Output() menuItemClicked: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;

  menuItems = [
    { label: "Nos produits", link: "/nos-produits" },
    { label: "Nos ateliers", link: "/nos-ateliers" },
    { label: "Notre brunch", link: "/notre-brunch" },
    { label: "Nos fournisseurs", link: "/nos-fournisseurs" },
    { label: "À propos de nous", link: "/a-propos-de-nous" }
  ];

  constructor(
    private menuStateService: MenuStateService, 
    private navigationService: NavigationService,
    private transitionService: TransitionService  // Injection du service de transition
  ) {}

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
    this.menuStateService.toggleMenu(this.navbarExpanded);
    if (this.navbarExpanded) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  animateIn() {
    gsap.from('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
    gsap.to('.navigation-elements', {
      x: '0%',
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.5 
    });
  }
  
  animateOut() {
    gsap.to('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut'
    });
  }

  handleNavItemClick(path: string): void {
    console.log(`Menu item clicked: ${path}`); // Vérifie le chemin cliqué
    this.navigationService.setCurrentRoute(path);
    this.transitionService.toggleTransition();
    console.log('Transition triggered and route set in NavigationService');
    gsap.to('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        console.log("Header expanded");
        this.expandHeader();
      }
    });
    this.menuItemClicked.emit();
  }

  expandHeader(): void {
    if (this.headerContainer) {
      gsap.to(this.headerContainer.nativeElement, {
        width: '100vw',
        duration: 1,
        ease: 'power3.inOut'
      });
    }
  }  
}
