import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuOpen = new BehaviorSubject<boolean>(false);

  menuOpen$ = this.menuOpen.asObservable();

  toggleMenu(open?: boolean): void {
    this.menuOpen.next(open !== undefined ? open : !this.menuOpen.value);
  }
}
