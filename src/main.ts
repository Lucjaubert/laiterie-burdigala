import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomepageComponent } from './app/shared/components/homepage/homepage.component';

const routes = [
    { path: '', component: HomepageComponent },
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient() 
    ]
}).catch(err => console.error(err));
