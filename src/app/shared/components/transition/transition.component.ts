import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TransitionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  shouldRender = true;
  private previousUrl: string = '';

  constructor(
    private transitionService: TransitionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const url = event.url;
        if ((this.previousUrl === '/' || this.previousUrl === '') && url === '/accueil') {
          this.shouldRender = false;
        } else if (url === '/' || url === '') {
          this.shouldRender = false;
        } else {
          this.shouldRender = true;
          this.cdr.detectChanges();
          this.transitionService.startTransition();
        }
        this.previousUrl = url;
      }
      if (event instanceof NavigationEnd) {
        this.previousUrl = event.urlAfterRedirects;
      }
    });

    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        if (this.shouldRender) {
          setTimeout(() => {
            if (show) {
              this.animateIn();
            } else {
              this.animateOut();
            }
          }, 100);
        }
      })
    );
  }

  animateIn(): void {
    const transitionContainer = document.querySelector('.transition-container') as HTMLElement;
    const backgroundBlur = document.querySelector('.background-blur') as HTMLElement;

    if (transitionContainer && backgroundBlur) {
      backgroundBlur.style.display = 'block';

      const tl = gsap.timeline();

      tl.to(backgroundBlur, {
        opacity: 1,
        duration: 0.5,
        ease: 'power1.inOut'
      });

      tl.add('start');

      tl.fromTo(transitionContainer, {
        x: '-100%'
      }, {
        x: '0%',
        duration: 1.5,
        ease: 'power2.out'
      }, 'start');

      tl.to('.logo-intro', {
        opacity: 1,
        duration: 2.5,
        ease: 'power2.out'
      }, 'start+=0.3');

      tl.to(backgroundBlur, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          backgroundBlur.style.display = 'none';
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
        duration: 1.6,
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
