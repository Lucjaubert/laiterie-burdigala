import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ReservationDraftService } from 'src/app/services/reservation-draft.service';
import { ReferralPromoService } from 'src/app/services/referral-promo.service';
import { BookingDetails, BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-reservation-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservation-confirmation.component.html',
  styleUrls: ['./reservation-confirmation.component.scss']
})
export class ReservationConfirmationComponent implements OnInit {
  stripeSessionId: string | null = null;
  bookingId: string | null = null;

  booking: BookingDetails | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  copySuccess = false;
  shareSuccess = false;
  shareError: string | null = null;

  private readonly referralLandingUrl = 'http://localhost:4200/nos-ateliers';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationDraftService: ReservationDraftService,
    private referralPromoService: ReferralPromoService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.stripeSessionId = this.route.snapshot.queryParamMap.get('session_id');
    this.bookingId = this.route.snapshot.queryParamMap.get('bookingId');

    this.reservationDraftService.clearDraft();
    this.referralPromoService.clearCode();

    if (this.stripeSessionId) {
      this.loadBooking(this.stripeSessionId);
    }
  }

  get truncatedStripeSessionId(): string | null {
    if (!this.stripeSessionId) {
      return null;
    }

    if (this.stripeSessionId.length <= 24) {
      return this.stripeSessionId;
    }

    return `${this.stripeSessionId.slice(0, 18)}...${this.stripeSessionId.slice(-8)}`;
  }

  get referralCode(): string {
    return this.booking?.referralCode || '';
  }

  get referralShareUrl(): string {
    if (!this.referralCode) {
      return this.referralLandingUrl;
    }

    return `${this.referralLandingUrl}?promo=${encodeURIComponent(this.referralCode)}`;
  }

  get referralShareText(): string {
    if (!this.referralCode) {
      return '';
    }

    return `Profite de -10 % sur ton atelier avec mon code ${this.referralCode} : ${this.referralShareUrl}`;
  }

  private loadBooking(sessionId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.bookingService.getBookingByStripeSession(sessionId).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (!response.success || !response.booking) {
          this.errorMessage = response.message || 'Impossible de récupérer les détails de réservation.';
          return;
        }

        this.booking = response.booking;
        this.bookingId = String(response.booking.id);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur récupération booking confirmation :', error);
        this.errorMessage = error?.error?.message || 'Impossible de charger la réservation.';
      }
    });
  }

  async copyReferralCode(): Promise<void> {
    if (!this.referralCode) {
      return;
    }

    this.copySuccess = false;
    this.shareSuccess = false;
    this.shareError = null;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.referralCode);
      } else {
        this.legacyCopyToClipboard(this.referralCode);
      }

      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2200);
    } catch (error) {
      console.error('Erreur copie code parrainage :', error);
      this.shareError = 'Impossible de copier le code pour le moment.';
    }
  }

  async shareReferralCode(event?: Event): Promise<void> {
    event?.stopPropagation();

    if (!this.referralCode) {
      return;
    }

    this.shareSuccess = false;
    this.shareError = null;

    const shareData: ShareData = {
      title: 'Code de parrainage Laiterie Burdigala',
      text: `Profite de -10 % sur ton atelier avec mon code ${this.referralCode}`,
      url: this.referralShareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        this.shareSuccess = true;
      } else {
        const fallbackText = this.referralShareText;

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(fallbackText);
        } else {
          this.legacyCopyToClipboard(fallbackText);
        }

        this.shareSuccess = true;
      }

      setTimeout(() => {
        this.shareSuccess = false;
      }, 2200);
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return;
      }

      console.error('Erreur partage code parrainage :', error);
      this.shareError = 'Impossible de partager le code pour le moment.';
    }
  }

  goToWorkshops(): void {
    this.router.navigate(['/nos-ateliers']);
  }

  goToHome(): void {
    this.router.navigate(['/accueil']);
  }

  private legacyCopyToClipboard(value: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
