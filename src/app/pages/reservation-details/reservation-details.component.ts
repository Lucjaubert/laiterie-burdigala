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

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.scss'],
})
export class ReservationDetailsComponent implements OnInit {
  draft: ReservationDraft | null = null;

  qty = 1;
  phone = '';
  isGift = false;

  promoCode = '';
  appliedDiscountPercent = 0;
  appliedDiscountAmount = 0;
  promoMessage: string | null = null;
  promoError: string | null = null;
  isApplyingPromo = false;
  private autoPromoTried = false;

  constructor(
    private router: Router,
    private reservationDraftService: ReservationDraftService,
    private referralPromoService: ReferralPromoService,
    private promoCodeService: PromoCodeService
  ) {}

  ngOnInit(): void {
    const existingDraft = this.reservationDraftService.getDraft();

    if (!existingDraft) {
      this.router.navigate(['/nos-ateliers']);
      return;
    }

    const storedReferralCode = this.referralPromoService.getCode() || '';
    const draftPromoCode = existingDraft.promoCode || '';

    this.draft = { ...existingDraft };
    this.qty = existingDraft.qty || 1;
    this.phone = existingDraft.phone || '';
    this.isGift = !!existingDraft.isGift;

    this.promoCode = storedReferralCode || draftPromoCode || '';
    this.appliedDiscountPercent = Number(existingDraft.discountPercent || 0);
    this.appliedDiscountAmount = Number(existingDraft.discountAmount || 0);

    if (this.promoCode && this.hasAppliedPromo) {
      this.promoMessage = this.appliedDiscountPercent > 0
        ? `Code appliqué : -${this.appliedDiscountPercent} %`
        : `Code appliqué : -${this.appliedDiscountAmount.toFixed(2)} €`;
    }

    this.persistDraft();

    if (this.promoCode && !this.hasAppliedPromo) {
      this.tryAutoApplyPromoCode();
    }
  }

  get availableQtyOptions(): number[] {
    const maxSeats = this.draft?.seatsLeft ?? 1;
    const max = Math.max(1, Math.min(maxSeats, 10));
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  get totalPrice(): number {
    if (!this.draft) return 0;
    return Number((this.qty * this.draft.unitPrice).toFixed(2));
  }

  get finalTotal(): number {
    const total = this.totalPrice - this.appliedDiscountAmount;
    return total > 0 ? Number(total.toFixed(2)) : 0;
  }

  get hasAppliedPromo(): boolean {
    return this.appliedDiscountPercent > 0 || this.appliedDiscountAmount > 0;
  }

  onQtyChange(): void {
    if (!this.draft) return;

    this.persistDraft();

    if (this.promoCode) {
      this.runPromoValidation(true);
    }
  }

  goBack(): void {
    window.history.back();
  }

  continue(): void {
    if (!this.draft) return;

    const updatedDraft: ReservationDraft = {
      ...this.draft,
      qty: this.qty,
      totalPrice: this.totalPrice,
      phone: this.phone,
      isGift: this.isGift,
      promoCode: this.normalizePromoCode(this.promoCode),
      discountPercent: this.appliedDiscountPercent,
      discountAmount: this.appliedDiscountAmount,
      finalTotal: this.finalTotal,
    };

    this.draft = updatedDraft;
    this.reservationDraftService.setDraft(updatedDraft);

    console.log('Draft réservation mis à jour :', updatedDraft);
    this.router.navigate(['/reservation/informations']);
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
      qty: this.qty,
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
      },
      error: (error) => {
        console.error('Erreur validation code promo :', error);
        if (!isAutomatic) {
          this.promoError = 'Impossible de valider le code promo pour le moment.';
        }
      }
    });
  }

  private persistDraft(code?: string): void {
    if (!this.draft) return;

    const normalizedCode = code !== undefined
      ? this.normalizePromoCode(code)
      : this.normalizePromoCode(this.promoCode);

    this.draft = {
      ...this.draft,
      qty: this.qty,
      totalPrice: this.totalPrice,
      phone: this.phone,
      isGift: this.isGift,
      promoCode: normalizedCode,
      discountPercent: this.appliedDiscountPercent,
      discountAmount: this.appliedDiscountAmount,
      finalTotal: this.finalTotal || this.totalPrice,
    };

    this.promoCode = normalizedCode;
    this.reservationDraftService.setDraft(this.draft);
  }

  private normalizePromoCode(value: string | null | undefined): string {
    return (value || '').trim().toUpperCase();
  }
}
