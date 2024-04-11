import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomepageComponent } from './app/shared/components/homepage/homepage.component';

const routes = [
    { path: '', component: HomepageComponent },
    { path: 'nos-produits', loadChildren: () => import('./app/shared/components/products/products.module').then(m => m.ProductsModule) },
    { path: 'finaliser-commande', loadChildren: () => import('./app/shared/components/order/order.module').then(m => m.OrderModule) },
    { path: 'nos-fournisseurs', loadChildren: () => import('./app/shared/components/suppliers/suppliers.module').then(m => m.SuppliersModule) },
    { path: 'notre-brunch', loadChildren: () => import('./app/shared/components/brunchs/brunchs.module').then(m => m.BrunchsModule) },
    { path: 'nos-ateliers', loadChildren: () => import('./app/shared/components/workshops/workshops.module').then(m => m.WorkshopsModule) },
    { path: 'à-propos-de-nous', loadChildren: () => import('./app/shared/components/about-us/about-us.module').then(m => m.AboutUsModule) },
    { path: 'intro', loadChildren: () => import('./app/shared/components/intro/intro.module').then(m => m.IntroModule) },
    { path: 'transition', loadChildren: () => import('./app/shared/components/transition/transition.module').then(m => m.TransitionModule)}
];

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient() 
    ]
}).catch(err => console.error(err));
