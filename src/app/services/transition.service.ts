import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private showTransition = new BehaviorSubject<boolean>(false);
  private transitionDone = new BehaviorSubject<boolean>(false);

  public showTransition$ = this.showTransition.asObservable();
  public transitionDone$ = this.transitionDone.asObservable();

  constructor() {}

  /**
   * Active ou désactive la transition.
   */
  toggleTransition(): void {
    console.log('Toggling transition');
    const currentState = this.showTransition.value;
    this.showTransition.next(!currentState);
    
    if (!currentState) {
      this.startTransition();
    }
  }
  
  startTransition(): void {
    console.log('Starting transition');
    setTimeout(() => {
      console.log('Transition complete');
      this.transitionDone.next(true);
    }, 1000); // Assurez-vous que ce délai correspond à la durée de votre animation
  }  
}
