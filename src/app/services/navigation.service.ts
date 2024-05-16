import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentRoute = new BehaviorSubject<string>('/default-route'); 
  public currentRoute$ = this.currentRoute.asObservable();

  constructor() {}

  setCurrentRoute(url: string): void {
    this.currentRoute.next(url);
  }  
}
