import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransitionComponent } from './shared/components/transition/transition.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FooterComponent,
        HeaderComponent,
        TransitionComponent,
        HttpClientModule
    ]
})
export class AppComponent {
    title = 'laiterie-burdigala';
    showTransition: boolean = false;
    isHomepage: boolean = false;

    constructor(private router: Router) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.isHomepage = this.router.url === '/' || this.router.url.startsWith('/accueil');
        });
    }

    toggleTransition(): void {
        this.showTransition = !this.showTransition;
        console.log(`Show transition set to ${this.showTransition}`);
    }
}
