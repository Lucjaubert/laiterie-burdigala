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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.shouldRender = true;
        this.transitionService.startTransition();
      }
      if (event instanceof NavigationEnd) {
        this.shouldRender = this.router.url !== '/' && this.router.url !== '/accueil';
        if (!this.shouldRender) {
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
    gsap.to('.transition-container', { x: '0%', duration: 2, ease: 'power2.out' });
    gsap.to('.logo-intro', { opacity: 1, duration: 1, ease: 'power2.out' });
  }

  animateOut(): void {
    gsap.to('.transition-container', { x: '-100%', duration: 2, ease: 'power2.in' });
    gsap.to('.logo-intro', { opacity: 0, duration: 1, ease: 'power2.in' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
