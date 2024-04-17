import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { gsap } from 'gsap';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuBurgerLogoComponent],
})
export class HeaderComponent {
  navbarExpanded: boolean = false;
  @Input() isHomepage: boolean = false;
  headerContainerWidth: number = 0;

  get headerClass(): string {
    if (this.isHomepage) {
      return 'fixed-on-homepage';
    } else {
      return '';
    }
  }

  toggleMenu(expand: boolean): void {
    this.navbarExpanded = expand;  

    if (this.navbarExpanded) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  animateIn() {
    gsap.to('.header-container', { 
      left: '0px', 
      width: '550px',  
      opacity: 1, 
      duration: 0.8, 
      ease: 'power3.out' 
    });
    gsap.to('.navbar-nav .nav-item', {
      opacity: 1, 
      delay: 0.3,
      duration: 2,
      stagger: 0.3,
      ease: 'power3.inOut'
    });
  }

  animateOut() {
    gsap.to('.header-container', {
      left: '-100%', 
      opacity: 0,
      duration: 1.8, 
      ease: 'power3.in'
    });
  }

  handleNavItemClick(): void {
    gsap.to('.navbar-nav .nav-item', {
      opacity: 0,
      duration: 1.8, 
      ease: 'power3.in', 
      onComplete: () => {
        this.animateOut(); 
      }
    });
  }

  updateHeaderWidth(): void {
    this.headerContainerWidth = this.navbarExpanded ? 300 : 0;
  }
}
