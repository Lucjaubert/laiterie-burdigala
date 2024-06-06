import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { WordpressService } from 'src/app/services/wordpress.service';
import { TransitionService } from 'src/app/services/transition.service';

interface AboutUsData {
  title: string;
  content: string;
  acf_fields: {
    "text-1": string;
    "text-2": string;
    "text-3": string;
    "image-1": string;
    "image-2": string;
    "image-3": string;
  };
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AboutUsComponent implements OnInit, AfterViewInit {
  aboutUsData$: Observable<AboutUsData[] | null>;
  private transitionSub: Subscription = new Subscription();

  constructor(
    private wpService: WordpressService,
    private transitionService: TransitionService
  ) {
    this.aboutUsData$ = this.wpService.getAboutUs();
  }

  ngOnInit(): void {
    this.transitionSub = this.transitionService.transitionDone$.subscribe(done => {
      if (done) {
        this.animateElements();
      }
    });
  }

  ngAfterViewInit(): void {
  }

  private animateElements(): void {
    gsap.from('.section-1 .text-content', { delay: 1.5, duration: 1, x: -100, opacity: 0, ease: 'power1.out' });
    gsap.from('.section-1 .image-container', { delay: 2, duration: 1, x: 100, opacity: 0, ease: 'power1.out' });

    gsap.from('.section-2 .text-content', { delay: 2, duration: 1.5, x: 100, opacity: 0, ease: 'power2.out' });
    gsap.from('.section-2 .image-container', { delay: 1.5, duration: 1.5, x: -100, opacity: 0, ease: 'power2.out' });

    gsap.from('.section-3 .text-content', { delay: 2, duration: 2, y: 100, opacity: 0, ease: 'power3.out' });
    gsap.from('.section-3 .image-container', { delay: 1.5, duration: 2, y: -100, opacity: 0, ease: 'power3.out' });

    gsap.from('.logo-1-overlay', { delay: 2.0, duration: 2, x: -100, opacity: 0, ease: 'power4.out' });
    gsap.from('.logo-2-overlay', { delay: 2.0, duration: 1.5, x: 100, opacity: 0, ease: 'power4.out' });
  }

  ngOnDestroy(): void {
    this.transitionSub.unsubscribe();
  }
}
