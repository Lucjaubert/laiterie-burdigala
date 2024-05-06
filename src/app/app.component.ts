import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, RouterStateSnapshot, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransitionComponent } from './shared/components/transition/transition.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, FooterComponent, HeaderComponent, TransitionComponent]
})
export class AppComponent {
    title = 'laiterie-burdigala';
    showTransition: boolean = false;
    isHomepage: boolean = false;

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            let currentRoute: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
            while (currentRoute) {
                if (currentRoute.data && currentRoute.data['isHomepage'] !== undefined) {
                    this.isHomepage = currentRoute.data['isHomepage'];
                    break;
                }
                currentRoute = currentRoute.firstChild;
            }
        });
    }

    toggleTransition(): void {
        this.showTransition = !this.showTransition;
    }
}