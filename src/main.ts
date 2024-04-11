import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomepageComponent } from './app/shared/components/homepage/homepage.component';

const routes = [
    { path: '', component: HomepageComponent },
    { path: 'nos-produits', loadChildren: () => import('./app/shared/components/products/products.module').then(m => m.ProductsModule) },
    { path: 'finaliser-commande', loadChildren: () => import('./app/shared/components/order/order.module').then(m => m.OrderModule) }
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient() 
    ]
}).catch(err => console.error(err));
