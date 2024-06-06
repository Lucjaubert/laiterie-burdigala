import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransitionComponent } from './shared/components/transition/transition.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({ selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true, 
    imports: [
        CommonModule,
        RouterModule,
        FooterComponent,
        HeaderComponent,
        TransitionComponent,
        MatSnackBarModule, 
        MatButtonModule,
    ], 
})
export class AppComponent {
    title = 'laiterie-burdigala';
    showTransition: boolean = false;
    isHomepage: boolean = false;
    showFooter: boolean = true;

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.isHomepage = this.router.url === '/' || this.router.url.startsWith('/accueil');
            this.showFooter = !(this.router.url === '/' || this.router.url === '/accueil'); 
        });
    }

    toggleTransition(): void {
        this.showTransition = !this.showTransition;
    }
}
