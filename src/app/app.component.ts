import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { TransitionComponent } from './shared/components/transition/transition.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, FooterComponent, HeaderComponent, TransitionComponent], 
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'laiterie-burdigala';
    showTransition: boolean = false;
    isHomepage: boolean = false

    toggleTransition(): void {
        this.showTransition = !this.showTransition;
    }
}
