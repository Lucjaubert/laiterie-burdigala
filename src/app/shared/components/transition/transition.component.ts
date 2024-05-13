import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'], 
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class TransitionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  shouldRender = true; // Contrôle le rendu du contenu du composant

  constructor(private transitionService: TransitionService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.shouldRender = this.router.url !== '/' && this.router.url !== '/accueil';
        if (this.shouldRender) {
          this.transitionService.startTransition();
        } else {
          this.transitionService.resetTransition();
        }
      }
    });

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
    console.log('Starting in-animation');
    gsap.to('.transition-container', { x: '0%', duration: 3, ease: 'power2.out' });
    gsap.to('.logo-intro', { opacity: 1, duration: 2, ease: 'power2.out' }); 
  }
  
  animateOut(): void {
    console.log('Starting out-animation');
    gsap.to('.transition-container', { x: '-100%', duration: 3, ease: 'power2.in' });
    gsap.to('.logo-intro', { opacity: 0, duration: 2, ease: 'power2.in' });
  }  
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}