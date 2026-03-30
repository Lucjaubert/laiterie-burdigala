import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ReservationDraft } from 'src/app/models/reservation.model';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';
import { ReferralPromoService } from 'src/app/services/referral-promo.service';
import {
  PromoCodeService,
  PromoValidateResponse
} from 'src/app/services/promo-code.service';
import {
  StripeCheckoutService,
  StripeCheckoutResponse
} from 'src/app/services/stripe-checkout.service';

@Component({
  selector: 'app-reservation-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation-payment.component.html',
  styleUrls: ['./reservation-payment.component.scss'],
})
export class ReservationPaymentComponent implements OnInit {
  draft: ReservationDraft | null = null;

  promoCode = '';
  cgvAccepted = false;

  appliedDiscountPercent = 0;
  appliedDiscountAmount = 0;

  promoMessage: string | null = null;
  promoError: string | null = null;
  paymentError: string | null = null;

  isApplyingPromo = false;
  isPaying = false;
  private autoPromoTried = false;

  constructor(
    private router: Router,
    private reservationDraftService: ReservationDraftService,
    private referralPromoService: ReferralPromoService,
    private promoCodeService: PromoCodeService,
    private stripeCheckoutService: StripeCheckoutService
  ) {}

  ngOnInit(): void {
    const existingDraft = this.reservationDraftService.getDraft();

    if (!existingDraft) {
      this.router.navigate(['/nos-ateliers']);
      return;
    }

    this.draft = { ...existingDraft };
    this.cgvAccepted = !!existingDraft.cgvAccepted;
    this.appliedDiscountPercent = Number(existingDraft.discountPercent || 0);
    this.appliedDiscountAmount = Number(existingDraft.discountAmount || 0);

    const storedReferralCode = this.referralPromoService.getCode();
    const draftPromoCode = existingDraft.promoCode || '';

    this.promoCode = storedReferralCode || draftPromoCode || '';

    if (this.promoCode && this.hasAppliedPromo) {
      if (this.appliedDiscountPercent > 0) {
        this.promoMessage = `Code appliqué : -${this.appliedDiscountPercent} %`;
      } else {
        this.promoMessage = `Code appliqué : -${this.appliedDiscountAmount.toFixed(2)} €`;
      }
    }

    if (storedReferralCode && !this.hasAppliedPromo) {
      this.tryAutoApplyPromoCode();
    }
  }

  get baseTotal(): number {
    return Number(this.draft?.totalPrice || 0);
  }

  get finalTotal(): number {
    const total = this.baseTotal - this.appliedDiscountAmount;
    return total > 0 ? Number(total.toFixed(2)) : 0;
  }

  get hasAppliedPromo(): boolean {
    return this.appliedDiscountPercent > 0 || this.appliedDiscountAmount > 0;
  }

  goBack(): void {
    this.persistDraft();
    this.router.navigate(['/reservation/informations']);
  }

  onCgvChange(): void {
    this.persistDraft();
  }

  applyPromoCode(): void {
    this.runPromoValidation(false);
  }

  private tryAutoApplyPromoCode(): void {
    if (this.autoPromoTried) {
      return;
    }

    this.autoPromoTried = true;
    this.runPromoValidation(true);
  }

  private runPromoValidation(isAutomatic: boolean): void {
    if (!this.draft || this.isApplyingPromo) {
      return;
    }

    const code = this.normalizePromoCode(this.promoCode);

    this.paymentError = null;
    this.promoMessage = null;
    this.promoError = null;
    this.appliedDiscountPercent = 0;
    this.appliedDiscountAmount = 0;

    if (!code) {
      if (!isAutomatic) {
        this.promoError = 'Veuillez saisir un code promo ou parrainage.';
      }
      this.persistDraft('');
      return;
    }

    this.isApplyingPromo = true;

    this.promoCodeService.validateCode({
      code,
      qty: this.draft.qty,
      unitPrice: this.draft.unitPrice,
      workshopSlug: this.draft.workshopSlug,
    })
    .pipe(finalize(() => (this.isApplyingPromo = false)))
    .subscribe({
      next: (response: PromoValidateResponse) => {
        if (!response.valid) {
          if (!isAutomatic) {
            this.promoError = response.message || 'Ce code est invalide.';
          }
          this.persistDraft(code);
          return;
        }

        this.appliedDiscountAmount = Number(response.discountAmount || 0);

        if (response.discountType === 'percent') {
          this.appliedDiscountPercent = Number(response.discountValue || 0);
          this.promoMessage = `Code appliqué : -${this.appliedDiscountPercent} %`;
        } else {
          this.appliedDiscountPercent = 0;
          this.promoMessage = `Code appliqué : -${Number(response.discountAmount || 0).toFixed(2)} €`;
        }

        this.persistDraft(code);
        console.log('Code promo validé par WordPress :', response);
      },
      error: (error) => {
        console.error('Erreur validation code promo :', error);
        if (!isAutomatic) {
          this.promoError = 'Impossible de valider le code promo pour le moment.';
        }
      }
    });
  }

  pay(): void {
    if (!this.draft || this.isPaying) {
      return;
    }

    this.promoError = null;
    this.paymentError = null;

    if (!this.cgvAccepted) {
      this.paymentError = 'Vous devez accepter les CGV avant de continuer.';
      return;
    }

    if (this.draft.isGift && !this.draft.giftRecipientEmail?.trim()) {
      this.paymentError = 'L’email du bénéficiaire est obligatoire pour un atelier offert.';
      return;
    }

    const updatedDraft = this.persistDraft();

    this.isPaying = true;

    this.stripeCheckoutService.createCheckoutSession({
      workshopSlug: updatedDraft.workshopSlug,
      workshopTitle: updatedDraft.workshopTitle,
      sessionId: updatedDraft.sessionId,
      startAt: updatedDraft.startAt,
      endAt: updatedDraft.endAt,

      qty: updatedDraft.qty,
      unitPrice: updatedDraft.unitPrice,
      totalPrice: updatedDraft.totalPrice,
      discountAmount: updatedDraft.discountAmount || 0,
      finalTotal: updatedDraft.finalTotal || this.finalTotal,
      promoCode: updatedDraft.promoCode || '',

      firstName: updatedDraft.firstName || '',
      lastName: updatedDraft.lastName || '',
      email: updatedDraft.email || '',
      phone: updatedDraft.phone || '',

      billingAddress1: updatedDraft.billingAddress1 || '',
      billingAddress2: updatedDraft.billingAddress2 || '',
      billingPostalCode: updatedDraft.billingPostalCode || '',
      billingCity: updatedDraft.billingCity || '',

      isGift: !!updatedDraft.isGift,
      giftRecipientFirstName: updatedDraft.giftRecipientFirstName || '',
      giftRecipientLastName: updatedDraft.giftRecipientLastName || '',
      giftRecipientEmail: updatedDraft.giftRecipientEmail || '',
      giftMessage: updatedDraft.giftMessage || '',
      giftSenderName: updatedDraft.giftSenderName || '',
    })
    .pipe(finalize(() => (this.isPaying = false)))
    .subscribe({
      next: (response: StripeCheckoutResponse) => {
        console.log('Réponse Stripe Checkout :', response);

        if (!response.success) {
          this.paymentError = response.message || 'Impossible de lancer le paiement Stripe.';
          return;
        }

        if (!response.checkoutUrl) {
          this.paymentError = response.message || 'Stripe n’a pas retourné d’URL de paiement.';
          return;
        }

        try {
          this.stripeCheckoutService.redirectToCheckout(response.checkoutUrl);
        } catch (error) {
          console.error('Erreur redirection Stripe :', error);
          this.paymentError = 'Impossible de rediriger vers Stripe.';
        }
      },
      error: (err) => {
        console.error('Erreur création session Stripe :', err);
        console.error('Status :', err.status);
        console.error('Error body :', err.error);
        console.error('Message :', err.message);

        this.paymentError =
          err?.error?.message ||
          err?.error?.error ||
          'Erreur Stripe API lors de la création de la Checkout Session.';
      }
    });
  }

  private persistDraft(code?: string): ReservationDraft {
    if (!this.draft) {
      throw new Error('Aucun draft de réservation disponible.');
    }

    const normalizedCode = code !== undefined
      ? this.normalizePromoCode(code)
      : this.normalizePromoCode(this.promoCode);

    const updatedDraft: ReservationDraft = {
      ...this.draft,
      promoCode: normalizedCode,
      discountPercent: this.appliedDiscountPercent,
      discountAmount: this.appliedDiscountAmount,
      finalTotal: this.finalTotal,
      cgvAccepted: this.cgvAccepted,
    };

    this.draft = updatedDraft;
    this.promoCode = normalizedCode;
    this.reservationDraftService.setDraft(updatedDraft);

    return updatedDraft;
  }

  private normalizePromoCode(value: string | null | undefined): string {
    return (value || '').trim().toUpperCase();
  }
}
