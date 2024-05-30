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
        this.cdr.detectChanges(); 
        this.transitionService.startTransition();
      }
      if (event instanceof NavigationEnd) {
        this.shouldRender = this.router.url !== '/' && this.router.url !== '/accueil';
        this.cdr.detectChanges(); 
        if (!this.shouldRender) {
          this.transitionService.resetTransition();
        }
      }
    });

    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        this.cdr.detectChanges(); 
        setTimeout(() => { 
          if (show && this.shouldRender) {
            this.animateIn();
          } else {
            this.animateOut();
          }
        }, 100); 
      })
    );
  }

  animateIn(): void {
    const transitionContainer = document.querySelector('.transition-container') as HTMLElement;
    const backgroundBlur = document.querySelector('.background-blur') as HTMLElement;
  
    if (transitionContainer && backgroundBlur) {
      // Assurez-vous que backgroundBlur est visible
      backgroundBlur.style.display = 'block';
      gsap.to(backgroundBlur, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut'
      });
  
      gsap.fromTo(transitionContainer, {
        x: '-100%'
      }, {
        x: '0%',
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.fromTo('.logo-intro', { opacity: 0 }, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          });
  
          // Vous pouvez choisir de cacher le backgroundBlur après l'animation ou le laisser visible
          gsap.to(backgroundBlur, {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
            onComplete: () => {
              backgroundBlur.style.display = 'none'; // Le cacher après la transition
            }
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
            this.cdr.detectChanges(); 
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
