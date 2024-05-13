import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private showTransition = new BehaviorSubject<boolean>(false);
  private transitionDone = new BehaviorSubject<boolean>(false);

  public showTransition$ = this.showTransition.asObservable();
  public transitionDone$ = this.transitionDone.asObservable();

  constructor() {}

  startTransition(): void {
    if (!this.showTransition.value) {
      console.log('Starting transition');
      this.showTransition.next(true);
      timer(3000).subscribe(() => {
        console.log('Transition complete');
        this.transitionDone.next(true);
        this.resetTransition();
      });
    }
  }
  
  resetTransition(): void {
    console.log('Resetting transition');
    this.showTransition.next(false);
    this.transitionDone.next(false);
  }  
}