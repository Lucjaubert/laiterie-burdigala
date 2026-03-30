import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { getWorkshopBySlug, WorkshopHardcoded } from 'src/app/config/workshops.config';
import { WorkshopAvailabilityDialogComponent } from '../workshop-availability-dialog/workshop-availability-dialog.component';
import { WorkshopSession } from 'src/app/services/workshop-slots.service';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';
import { ReferralPromoService } from 'src/app/services/referral-promo.service';
import { ReservationDraft } from 'src/app/models/reservation.model';

type ReviewItem = {
  author: string;
  date: string;
  rating?: number;
  text: string;
};

type DialogResult = {
  session?: WorkshopSession;
} | undefined;

@Component({
  selector: 'app-workshop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './workshop-detail.component.html',
  styleUrls: ['./workshop-detail.component.scss'],
})
export class WorkshopDetailComponent implements OnDestroy {
  workshop: WorkshopHardcoded | null = null;
  private sub = new Subscription();

  selectedSession: WorkshopSession | null = null;
  referralCode: string | null = null;
  referralDiscountPercent = 10;

  reviews: ReviewItem[] = [
    { author: 'Léa', date: '27/02/2026', rating: 5, text: 'Super moment, je recommande !' },
    { author: 'Cyril', date: '21/02/2026', rating: 5, text: 'Atelier convivial et très instructif.' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private reservationDraftService: ReservationDraftService,
    private referralPromoService: ReferralPromoService
  ) {
    this.sub.add(
      this.route.paramMap.subscribe((params) => {
        const slug = params.get('slug') || '';
        this.workshop = getWorkshopBySlug(slug);

        this.selectedSession = null;
        this.referralCode = this.referralPromoService.getCode();

        if (!this.workshop) {
          this.router.navigate(['/nos-ateliers']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get hasReferralPromo(): boolean {
    return !!this.referralCode;
  }

  get discountedPricePerPerson(): number {
    if (!this.workshop) {
      return 0;
    }

    if (!this.hasReferralPromo) {
      return this.workshop.pricePerPerson;
    }

    const discounted = this.workshop.pricePerPerson * (1 - this.referralDiscountPercent / 100);
    return Number(discounted.toFixed(2));
  }

  getSafeVideoUrl(url?: string): SafeResourceUrl | null {
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getMapEmbedUrl(address: string): SafeResourceUrl {
    const url = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openAvailabilities(): void {
    if (!this.workshop) return;

    const ref = this.dialog.open(WorkshopAvailabilityDialogComponent, {
      width: '980px',
      maxWidth: '95vw',
      panelClass: 'burdigala-dialog',
      data: {
        workshopSlug: this.workshop.slug,
        workshopTitle: this.workshop.title,
      },
    });

    this.sub.add(
      ref.afterClosed().subscribe((result: DialogResult) => {
        if (!result?.session || !this.workshop) return;

        const qty = 1;
        const unitPrice = this.workshop.pricePerPerson;
        const totalPrice = qty * unitPrice;
        const referralCode = this.referralPromoService.getCode() || '';

        const draft: ReservationDraft = {
          workshopSlug: this.workshop.slug,
          workshopTitle: this.workshop.title,
          sessionId: result.session.id,
          startAt: result.session.startAt,
          endAt: result.session.endAt,
          qty,
          unitPrice,
          totalPrice,
          seatsLeft: result.session.seatsLeft,
          capacity: result.session.capacity,
          booked: result.session.booked,
          summary: result.session.summary,
          promoCode: referralCode,
          discountPercent: 0,
          discountAmount: 0,
          finalTotal: totalPrice,
        };

        this.reservationDraftService.setDraft(draft);
        console.log('Draft réservation enregistré :', draft);

        this.router.navigate(['/reservation/details']);
      })
    );
  }

  giftWorkshop(): void {
    console.log('gift');
  }

  privatizeWorkshop(): void {
    console.log('privatize');
  }

  leaveReview(): void {
    console.log('leave review');
  }
}
