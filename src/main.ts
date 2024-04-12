import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomepageComponent } from './app/shared/components/homepage/homepage.component';
import { IntroComponent } from './app/shared/components/intro/intro.component';

const routes = [
    { path: '', component: IntroComponent },
    { path: 'accueil', component: HomepageComponent },
    { path: 'nos-produits', loadChildren: () => import('./app/shared/components/products/products.module').then(m => m.ProductsModule) },
    { path: 'finaliser-commande', loadChildren: () => import('./app/shared/components/order/order.module').then(m => m.OrderModule) },
    { path: 'nos-ateliers', loadChildren: () => import('./app/shared/components/workshops/workshops.module').then(m => m.WorkshopsModule) },
    { path: 'notre-brunch', loadChildren: () => import('./app/shared/components/brunch/brunch.module').then(m => m.BrunchModule) },
    { path: 'nos-fournisseurs', loadChildren: () => import('./app/shared/components/suppliers/suppliers.module').then(m => m.SuppliersModule) },
    { path: 'a-propos-de-nous', loadChildren: () => import('./app/shared/components/about-us/about-us.module').then(m => m.AboutUsModule) },
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient() 
    ]
}).catch(err => console.error(err));
