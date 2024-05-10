import { IntroComponent } from './pages/intro/intro.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrderComponent } from './pages/order/order.component';
import { WorkshopsComponent } from './pages/workshops/workshops.component';
import { BrunchComponent } from './pages/brunch/brunch.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';

export const routes = [
    { path: '', component: IntroComponent, title: 'Introduction' },
    { path: 'accueil', component: HomepageComponent, title: 'Accueil' },
    { path: 'nos-produits', component: ProductsComponent, title: 'Nos Produits' },
    { path: 'finaliser-commande', component: OrderComponent, title: 'Finaliser Commande' },
    { path: 'nos-ateliers', component: WorkshopsComponent, title: 'Nos Ateliers' },
    { path: 'notre-brunch', component: BrunchComponent, title: 'Notre Brunch' },
    { path: 'nos-fournisseurs', component: SuppliersComponent, title: 'Nos Fournisseurs' },
    { path: 'a-propos-de-nous', component: AboutUsComponent, title: 'À Propos de Nous' }
];
