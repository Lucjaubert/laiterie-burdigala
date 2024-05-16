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
      this.showTransition.next(true);
      timer(3000).subscribe(() => {
        this.transitionDone.next(true);
        this.resetTransition();
      });
    }
  }
  
  resetTransition(): void {
    this.showTransition.next(false);
    this.transitionDone.next(false);
  }  
}