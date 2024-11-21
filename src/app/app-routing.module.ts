import { IntroComponent } from './pages/intro/intro.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrderComponent } from './pages/order/order.component';
import { WorkshopsComponent } from './pages/workshops/workshops.component';
import { BrunchComponent } from './pages/brunch/brunch.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LegalNoticesComponent } from './pages/legal-documents/LegalNotices/legal-notices.component';
import { PrivacyPolicyComponent } from './pages/legal-documents/PrivacyPolicy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/legal-documents/TermsConditions/terms-conditions.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes = [
    { path: '', component: IntroComponent, title: 'Introduction', data: { hideHeaderFooter: false } },
    { path: 'accueil', component: HomepageComponent, title: 'Accueil', data: { hideHeaderFooter: false } },
    { path: 'nos-produits', component: ProductsComponent, title: 'Nos Produits', data: { hideHeaderFooter: false } },
    { path: 'finaliser-commande', component: OrderComponent, title: 'Finaliser Commande', data: { hideHeaderFooter: false } },
    { path: 'nos-ateliers', component: WorkshopsComponent, title: 'Nos Ateliers', data: { hideHeaderFooter: false } },
    { path: 'notre-brunch', component: BrunchComponent, title: 'Notre Brunch', data: { hideHeaderFooter: false } },
    { path: 'nos-fournisseurs', component: SuppliersComponent, title: 'Nos Fournisseurs', data: { hideHeaderFooter: false } },
    { path: 'a-propos-de-nous', component: AboutUsComponent, title: 'À Propos de Nous', data: { hideHeaderFooter: false } },
    { path: 'mentions-legales', component: LegalNoticesComponent, title: 'Mentions Légales', data: { hideHeaderFooter: false } },
    { path: 'politique-de-confidentialite', component: PrivacyPolicyComponent, title: 'Politique de Confidentialité', data: { hideHeaderFooter: false } },
    { path: 'conditions-generales-de-vente', component: TermsConditionsComponent, title: 'Conditions Générales de Ventes', data: { hideHeaderFooter: false } },
    { path: '**', component: NotFoundComponent, title: 'Page non trouvée', data: { hideHeaderFooter: true } }
];
