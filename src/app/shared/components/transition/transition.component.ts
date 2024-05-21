import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TransitionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  shouldRender = true;

  constructor(private transitionService: TransitionService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to manage the visibility of the transition component
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Set shouldRender to true at the start of navigation
        this.shouldRender = true;
        this.transitionService.startTransition();
      }
      if (event instanceof NavigationEnd) {
        // Keep the component rendered unless the navigation ends at home or 'accueil'
        this.shouldRender = this.router.url !== '/' && this.router.url !== '/accueil';
        if (!this.shouldRender) {
          this.transitionService.resetTransition();
        }
      }
    });

    // Subscribe to transition service to handle show/hide transitions
    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        if (show && this.shouldRender) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      })
    );
  }

  animateIn(): void {
    // S'assurer que le conteneur de transition et le logo sont prêts pour l'animation
    gsap.set('.transition-container', { x: '-100%' }); // Commence caché à gauche
    gsap.set('.logo-intro', { opacity: 0 });           // Commence totalement transparent
  
    // Animer le conteneur de transition pour qu'il se déplace de gauche à droite
    gsap.to('.transition-container', {
      x: '0%',            // Termine entièrement visible à droite
      duration: 2,
      ease: 'power2.out', // Utilisez un effet d'easing pour un mouvement plus naturel
      onComplete: () => {
        // Commencer à animer le logo après que le conteneur est en place
        gsap.to('.logo-intro', {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        });
      }
    });
  }  

  animateOut(): void {
    // Animate the transition container to move left to right and the logo to fade out
    gsap.to('.transition-container', {
      x: '-100%',
      duration: 2,
      ease: 'power2.in',
      onComplete: () => {
        setTimeout(() => {
          this.shouldRender = false;  // Hide the container after animation
        }, 100);  // Delay hiding to ensure animation completes
      }
    });
    gsap.to('.logo-intro', {
      opacity: 0,
      duration: 1,
      ease: 'power2.in'
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
