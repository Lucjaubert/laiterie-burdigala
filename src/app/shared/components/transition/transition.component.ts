import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransitionService } from 'src/app/services/transition.service';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'], 
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class TransitionComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private transitionService: TransitionService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.transitionService.showTransition$.subscribe(show => {
        if (show) {
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
  }
  
  animateOut(): void {
    console.log('Starting out-animation');
    gsap.to('.transition-container', { x: '-100%', duration: 3, ease: 'power2.in' });
  }  
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
