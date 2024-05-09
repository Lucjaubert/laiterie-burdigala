import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private menuOpen = new BehaviorSubject<boolean>(false);
  private currentRoute = new BehaviorSubject<string>('/'); // Défaut ou page d'accueil

  menuOpen$ = this.menuOpen.asObservable();
  currentRoute$ = this.currentRoute.asObservable(); // Observable pour la route actuelle

  toggleMenu(open?: boolean): void {
    this.menuOpen.next(open !== undefined ? open : !this.menuOpen.value);
  }

  setCurrentRoute(route: string): void {
    console.log(`Setting current route to: ${route}`);
    this.currentRoute.next(route);
  }

  getCurrentRoute(): string {
    return this.currentRoute.value;
  }
}
