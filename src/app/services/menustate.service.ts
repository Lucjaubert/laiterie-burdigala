import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuOpen = new BehaviorSubject<boolean>(false);
  private currentRoute = new BehaviorSubject<string>('/'); 

  menuOpen$ = this.menuOpen.asObservable();
  currentRoute$ = this.currentRoute.asObservable(); 

  toggleMenu(open?: boolean): void {
    this.menuOpen.next(open !== undefined ? open : !this.menuOpen.value);
  }

  setCurrentRoute(route: string): void {
    this.currentRoute.next(route);
  }

  getCurrentRoute(): string {
    return this.currentRoute.value;
  }
}
