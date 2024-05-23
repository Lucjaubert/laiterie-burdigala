import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private transitionService: TransitionService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.shouldRender = true;
        this.cdr.detectChanges(); // Assurez-vous que le DOM est mis à jour
        this.transitionService.startTransition();
      }
      if (event instanceof NavigationEnd) {
        this.shouldRender = this.router.url !== '/' && this.router.url !== '/accueil';
        this.cdr.detectChanges(); // Assurez-vous que le DOM est mis à jour
        if (!this.shouldRender) {
          this.transitionService.resetTransition();
        }
      }
    });

    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        this.cdr.detectChanges(); // Force Angular à détecter les changements
        setTimeout(() => { // Ajoutez un délai pour laisser le DOM se stabiliser
          if (show && this.shouldRender) {
            this.animateIn();
          } else {
            this.animateOut();
          }
        }, 100); // Délai ajustable selon le besoin
      })
    );
  }

  animateIn(): void {
    if (document.querySelector('.transition-container')) {
      gsap.fromTo('.transition-container', {
        x: '-100%'
      }, {
        x: '0%',
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.fromTo('.logo-intro', { opacity: 0 }, {
            opacity: 1,
            duration: 1, // Contrôle le temps entre l'opacité de 0 à 1
            //delay: 0.5, 
            ease: 'power2.out' // Ralentit à la fin de l'animation d'opacité
          });
        }
      });
    }
  }  

  animateOut(): void {
    if (document.querySelector('.transition-container') && document.querySelector('.logo-intro')) {
      gsap.to('.transition-container', {
        x: '-100%',
        duration: 2,
        ease: 'power2.in',
        onComplete: () => {
          setTimeout(() => {
            this.shouldRender = false;
            this.cdr.detectChanges(); // Force Angular à détecter les changements
          }, 100); 
        }
      });
      gsap.to('.logo-intro', {
        opacity: 0,
        duration: 1,
        ease: 'power2.in'
      });
    } else {
      console.warn('GSAP targets not found');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
