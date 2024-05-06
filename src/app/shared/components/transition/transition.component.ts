import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  standalone: true
})
export class TransitionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private transitionService: TransitionService) {}

  ngOnInit(): void {
    this.subscription = this.transitionService.showTransition$.subscribe(show => {
      if (show) {
        this.animateIn();
      } else {
        this.animateOut();
      }
    });
  }

  animateIn(): void {
    gsap.to('.transition-container', { opacity: 1, duration: 1, ease: 'power2.out' });
  }

  animateOut(): void {
    gsap.to('.transition-container', { opacity: 0, duration: 1, ease: 'power2.in' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
