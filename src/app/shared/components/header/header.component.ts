import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component'; // Adjust path as necessary

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuBurgerLogoComponent]
})
export class HeaderComponent {
  navbarExpanded: boolean = false;
  headerContainerWidth: number = 550; 

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
    if (this.navbarExpanded) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  animateIn() {
    gsap.to('.header-container', {
      left: '0px',
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out'
    });
    gsap.fromTo('.navbar-nav .nav-item', { opacity: 0 }, {
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power4.inOut'
    });
  }

  animateOut() {
    // Animate out nav items first
    gsap.to('.navbar-nav .nav-item', {
      opacity: 0,
      duration: 0.5,
      ease: 'power4.in',
      stagger: 0.1,
      onComplete: () => {
        // Once nav items are invisible, introduce a delay before sliding out the header container
        gsap.to('.header-container', {
          left: '-100%',
          duration: 1.0,  // Increase the duration if needed
          delay: 0.2,     // Delay before starting the slide out animation
          ease: 'power4.in'
        });
      }
    });
    this.navbarExpanded = false; // Ensure the navbar state is updated
  }  

  handleNavItemClick(): void {
    this.animateOut();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.headerContainerWidth = window.innerWidth < 769 ? 550 : 300;
  }
}
