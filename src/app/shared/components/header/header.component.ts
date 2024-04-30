import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuBurgerLogoComponent]
})
export class HeaderComponent {
  @Input() isHomepage: boolean = true;
  navbarExpanded: boolean = false;
  headerContainerWidth: number = 550;
  menuItems = [
    { label: "Nos produits", link: "/nos-produits" },
    { label: "Nos ateliers", link: "/nos-ateliers" },
    { label: "Notre brunch", link: "/notre-brunch" },
    { label: "Nos fournisseurs", link: "/nos-fournisseurs" },
    { label: "À propos de nous", link: "/a-propos-de-nous" }
  ];

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
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
      delay: 1 
    });
  }
  
  animateOut() {
    gsap.to('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        this.navbarExpanded = false; // Mettre à jour l'état du menu burger une fois l'animation terminée
      }
    });
  }
  
  handleNavItemClick(): void {
    this.animateOut();
  }
}
