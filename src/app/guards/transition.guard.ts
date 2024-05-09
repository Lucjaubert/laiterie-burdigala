import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransitionService } from '../services/transition.service';

@Injectable({
  providedIn: 'root'
})
export class TransitionGuard implements CanActivate {
  constructor(private transitionService: TransitionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.transitionService.transitionDone$.pipe(
      map(done => {
        if (done) {
          return true; // La transition est terminée, la navigation peut continuer
        } else {
          // Optionnel : déclencher la transition si ce n'est pas déjà fait
          this.transitionService.toggleTransition();
          return false; // Attendre que la transition soit terminée
        }
      })
    );
  }
}
