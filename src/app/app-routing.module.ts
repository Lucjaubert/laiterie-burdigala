import { IntroComponent } from './pages/intro/intro.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ProductsComponent } from './pages/products/products.component';
import { OrderComponent } from './pages/order/order.component';
import { WorkshopsComponent } from './pages/workshops/workshops.component';
import { WorkshopDetailComponent } from './pages/workshop-detail/workshop-detail.component';
import { ReservationDetailsComponent } from './pages/reservation-details/reservation-details.component';
import { ReservationInformationsComponent } from './pages/reservation-informations/reservation-informations.component';
import { ReservationPaymentComponent } from './pages/reservation-payment/reservation-payment.component';
import { ReservationConfirmationComponent } from './pages/reservation-confirmation/reservation-confirmation.component';
import { PrivatizationRequestComponent } from './pages/privatization-request/privatization-request.component';
import { BrunchComponent } from './pages/brunch/brunch.component';
import { SuppliersComponent } from './pages/suppliers/suppliers.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LegalNoticesComponent } from './pages/legal-documents/LegalNotices/legal-notices.component';
import { PrivacyPolicyComponent } from './pages/legal-documents/PrivacyPolicy/privacy-policy.component';
import { TermsConditionsComponent } from './pages/legal-documents/TermsConditions/terms-conditions.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes = [
  { path: '', component: IntroComponent, title: 'Introduction', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'accueil', component: HomepageComponent, title: 'Accueil', data: { hideHeaderFooter: false } },
  { path: 'nos-produits', component: ProductsComponent, title: 'Nos Produits', data: { hideHeaderFooter: false } },
  { path: 'finaliser-commande', component: OrderComponent, title: 'Finaliser Commande', data: { hideHeaderFooter: false } },

  { path: 'nos-ateliers', component: WorkshopsComponent, title: 'Nos Ateliers', data: { hideHeaderFooter: false } },
  { path: 'nos-ateliers/:slug', component: WorkshopDetailComponent, title: 'Détail atelier', data: { hideHeaderFooter: false } },

  { path: 'reservation/details', component: ReservationDetailsComponent, title: 'Détails de la réservation', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'reservation/informations', component: ReservationInformationsComponent, title: 'Informations de réservation', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'reservation/paiement', component: ReservationPaymentComponent, title: 'Paiement', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'reservation/confirmation', component: ReservationConfirmationComponent, title: 'Confirmation de réservation', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'privatisation', component: PrivatizationRequestComponent, title: 'Privatisation', data: { hideHeaderFooter: false, disableTransition: true } },
  { path: 'notre-brunch', component: BrunchComponent, title: 'Notre Brunch', data: { hideHeaderFooter: false } },
  { path: 'nos-fournisseurs', component: SuppliersComponent, title: 'Nos Fournisseurs', data: { hideHeaderFooter: false } },
  { path: 'a-propos-de-nous', component: AboutUsComponent, title: 'À Propos de Nous', data: { hideHeaderFooter: false } },
  { path: 'mentions-legales', component: LegalNoticesComponent, title: 'Mentions Légales', data: { hideHeaderFooter: false } },
  { path: 'politique-de-confidentialite', component: PrivacyPolicyComponent, title: 'Politique de Confidentialité', data: { hideHeaderFooter: false } },
  { path: 'conditions-generales-de-vente', component: TermsConditionsComponent, title: 'Conditions Générales de Ventes', data: { hideHeaderFooter: false } },

  { path: '**', component: NotFoundComponent, title: 'Page non trouvée', data: { hideHeaderFooter: true, disableTransition: true } }
];
