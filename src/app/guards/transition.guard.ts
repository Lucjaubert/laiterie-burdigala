import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TransitionService } from '../services/transition.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransitionGuard implements CanActivate {
  constructor(private transitionService: TransitionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Affiche des informations sur la route actuelle et la cible pour le debugging
    console.log(`Guard activated for route ${next.url}, navigating from ${state.url}`);

    // Ecoute si la transition est terminée
    return this.transitionService.transitionDone$.pipe(
      take(1), // Prend seulement le premier événement pour éviter les souscriptions multiples
      map(done => {
        console.log(`Transition status: ${done}`);
        if (done) {
          console.log('Transition is done, allowing navigation');
          return true; // Permet la navigation si la transition est terminée
        } else {
          console.log('Transition not done, blocking navigation');
          // Redirige vers la page actuelle ou une autre page de fallback
          return this.router.createUrlTree(['/fallback-route']); // Remplacez '/fallback-route' par une route valide si nécessaire
        }
      })
    );
  }
}
