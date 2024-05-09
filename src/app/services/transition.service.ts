import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private showTransition = new BehaviorSubject<boolean>(false);
  private transitionDone = new BehaviorSubject<boolean>(false);

  public showTransition$ = this.showTransition.asObservable();
  public transitionDone$ = this.transitionDone.asObservable();

  constructor() {}

  toggleTransition(): void {
    console.log('Toggling transition');
    this.showTransition.next(true);
    this.startTransition();
  }
  
  startTransition(): void {
    console.log('Starting transition');
    // Changed setTimeout to timer from rxjs for better handling of async operations
    timer(3000).subscribe(() => {
      console.log('Transition complete');
      this.transitionDone.next(true);
    });
  }
  
  resetTransition(): void {
    console.log('Resetting transition');
    this.showTransition.next(false);
    this.transitionDone.next(false);
  }  
}
