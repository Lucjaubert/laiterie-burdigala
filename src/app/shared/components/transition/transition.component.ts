import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';
import { Router, NavigationEnd, NavigationStart, Route } from '@angular/router';
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
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          const nextUrl = event.url;

          const disableForNext = this.shouldDisableTransition(nextUrl);
          const disableForPrevious = this.shouldDisableTransition(this.previousUrl);

          if (
            disableForNext ||
            disableForPrevious ||
            (this.previousUrl === '/' || this.previousUrl === '') && nextUrl === '/accueil' ||
            nextUrl === '/' ||
            nextUrl === ''
          ) {
            this.shouldRender = false;
          } else {
            this.shouldRender = true;
            this.cdr.detectChanges();
            this.transitionService.startTransition();
          }

          this.previousUrl = nextUrl;
        }

        if (event instanceof NavigationEnd) {
          this.previousUrl = event.urlAfterRedirects;
        }
      })
    );

    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        if (!this.shouldRender) return;

        setTimeout(() => {
          if (show) {
            this.animateIn();
          } else {
            this.animateOut();
          }
        }, 100);
      })
    );
  }

  private shouldDisableTransition(url: string): boolean {
    if (!url) return false;

    const cleanUrl = url.split('?')[0].split('#')[0];

    return this.matchesDisabledRoute(cleanUrl, this.router.config);
  }

  private matchesDisabledRoute(url: string, routes: Route[]): boolean {
    const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;

    for (const route of routes) {
      if (!route.path) continue;

      const routePath = route.path;

      // Match simple exact
      if (!routePath.includes(':') && normalizedUrl === routePath) {
        if (route.data?.['disableTransition']) return true;
      }

      // Match avec paramètre : ex nos-ateliers/:slug
      if (routePath.includes(':')) {
        const routeSegments = routePath.split('/');
        const urlSegments = normalizedUrl.split('/');

        if (routeSegments.length === urlSegments.length) {
          const isMatch = routeSegments.every((segment, index) => {
            return segment.startsWith(':') || segment === urlSegments[index];
          });

          if (isMatch && route.data?.['disableTransition']) {
            return true;
          }
        }
      }
    }

    return false;
  }

  animateIn(): void {
    const transitionContainer = document.querySelector('.transition-container') as HTMLElement | null;
    const backgroundBlur = document.querySelector('.background-blur') as HTMLElement | null;
    const logoIntro = document.querySelector('.logo-intro') as HTMLElement | null;

    if (transitionContainer && backgroundBlur && logoIntro) {
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

      tl.to(logoIntro, {
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
    const transitionContainer = document.querySelector('.transition-container') as HTMLElement | null;
    const logoIntro = document.querySelector('.logo-intro') as HTMLElement | null;

    if (transitionContainer && logoIntro) {
      gsap.to(transitionContainer, {
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

      gsap.to(logoIntro, {
        opacity: 0,
        duration: 1.6,
        ease: 'power2.in'
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
