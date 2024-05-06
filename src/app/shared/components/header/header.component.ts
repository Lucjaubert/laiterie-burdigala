import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';
import { MenuStateService } from 'src/app/services/menustate.service';

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

  @Output() menuItemClicked: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;

  menuItems = [
    { label: "Nos produits", link: "/nos-produits" },
    { label: "Nos ateliers", link: "/nos-ateliers" },
    { label: "Notre brunch", link: "/notre-brunch" },
    { label: "Nos fournisseurs", link: "/nos-fournisseurs" },
    { label: "À propos de nous", link: "/a-propos-de-nous" }
  ];

  constructor(private menuStateService: MenuStateService) {}

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

  handleNavItemClick(): void {
    // Triggering animation to hide menu items and start expanding the header after menu items are hidden.
    gsap.to('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        // Start expanding the header after the menu items are hidden.
        console.log("Header expanded");
        this.expandHeader();
      }
    });

    this.menuItemClicked.emit();
  }

  expandHeader(): void {
    if (this.headerContainer) {
      // Expand header-container to 100vw
      gsap.to(this.headerContainer.nativeElement, {
        width: '100vw',
        duration: 1,
        ease: 'power3.inOut'
      });
    }
  }  
}
