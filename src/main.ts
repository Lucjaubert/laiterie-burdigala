import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomepageComponent } from './app/pages/homepage/homepage.component';
import { IntroComponent } from './app/pages/intro/intro.component';

const routes: Routes = [
    { path: '', component: IntroComponent },
    { path: 'accueil', component: HomepageComponent },
    { path: 'nos-produits', loadChildren: () => import('./app/pages/products/products.module').then(m => m.ProductsModule) },
    { path: 'finaliser-commande', loadChildren: () => import('./app/pages/order/order.module').then(m => m.OrderModule) },
    { path: 'nos-ateliers', loadChildren: () => import('./app/pages/workshops/workshops.module').then(m => m.WorkshopsModule) },
    { path: 'notre-brunch', loadChildren: () => import('./app/pages/brunch/brunch.module').then(m => m.BrunchModule) },
    { path: 'nos-fournisseurs', loadChildren: () => import('./app/pages/suppliers/suppliers.module').then(m => m.SuppliersModule) },
    { path: 'a-propos-de-nous', loadChildren: () => import('./app/pages/about-us/about-us.module').then(m => m.AboutUsModule) },
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes)
    ]
}).catch(err => console.error(err));