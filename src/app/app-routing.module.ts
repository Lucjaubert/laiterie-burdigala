// Importez les modules nécessaires
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './shared/components/homepage/homepage.component';
import { IntroComponent } from './shared/components/intro/intro.component';
import { TransitionGuard } from './guards/transition.guard'; // Assurez-vous que le chemin d'importation est correct
import { ProductsComponent } from './shared/components/products/products.component';

// Définissez les routes de votre application
const routes: Routes = [
  { 
    path: '', 
    component: IntroComponent, 
    //canActivate: [TransitionGuard], // Applique TransitionGuard à cette route
    data: { isHomepage: false }
  },
  { 
    path: 'accueil', 
    component: HomepageComponent, 
    canActivate: [TransitionGuard], // Applique TransitionGuard à cette route également
    data: { isHomepage: true }
  },
  { 
    path: 'nos-produits', 
    component: ProductsComponent,
    canActivate: [TransitionGuard], // Applique TransitionGuard à cette route également
    data: { isHomepage: false }
  },
  //{ 
  //  path: 'finaliser-commande', 
  //  loadChildren: () => import('./shared/components/order/order.module').then(m => m.OrderModule), 
  //  data: { isHomepage: false } 
  //},
  //{ 
  //  path: 'nos-ateliers', 
  //  loadChildren: () => import('./shared/components/workshops/workshops.module').then(m => m.WorkshopsModule), 
  //  data: { isHomepage: false } 
  //},
  //{ 
  //  path: 'notre-brunch', 
  //  loadChildren: () => import('./shared/components/brunch/brunch.module').then(m => m.BrunchModule), 
  //  data: { isHomepage: false } 
  //},
  //{ 
  //  path: 'nos-fournisseurs', 
  //  loadChildren: () => import('./shared/components/suppliers/suppliers.module').then(m => m.SuppliersModule), 
  //  data: { isHomepage: false } 
  //},
  //{ 
  //  path: 'a-propos-de-nous', 
  //  loadChildren: () => import('./shared/components/about-us/about-us.module').then(m => m.AboutUsModule), 
  //  data: { isHomepage: false } 
  //},
];

// Décorez la classe avec @NgModule, importez et exportez RouterModule
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
