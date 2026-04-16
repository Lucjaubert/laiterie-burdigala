import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { getWorkshopBySlug, WorkshopHardcoded } from 'src/app/config/workshops.config';
import { WorkshopAvailabilityDialogComponent } from '../workshop-availability-dialog/workshop-availability-dialog.component';
import { ReviewDialogComponent, ReviewDialogResult } from '../review-dialog/review-dialog.component';
import { WorkshopSession } from 'src/app/services/workshop-slots.service';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';
import { ReferralPromoService } from 'src/app/services/referral-promo.service';
import { ReservationDraft } from 'src/app/models/reservation.model';

type ReviewItem = {
  author: string;
  displayDate: string;
  timestamp: number;
  rating?: number;
  text: string;
  source?: 'wecandoo' | 'site';
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

  showAllReviews = false;

  reviews: ReviewItem[] = [
    {
      author: 'Gil J',
      displayDate: '19/03/2026',
      timestamp: new Date('2026-03-19').getTime(),
      rating: 5,
      text: 'Super expérience ! Claire était top ! Les produits sont excellents. 😋',
      source: 'wecandoo',
    },
    {
      author: 'Marion C',
      displayDate: '18/03/2026',
      timestamp: new Date('2026-03-18').getTime(),
      rating: 5,
      text: `Très chouette comme atelier. Nous avons apprécié les quelques explications et surtout la fabrication ! Dégustation faite le lendemain des produits préparés : c'était excellent :)`,
      source: 'wecandoo',
    },
    {
      author: 'Rebecca V',
      displayDate: '16/03/2026',
      timestamp: new Date('2026-03-16').getTime(),
      rating: 5,
      text: 'Super atelier avec plein d\'explications intéressantes sur la fabrication du fromage et la pratique nous a permis de déguster de très bonnes mozzarella et burrata !',
      source: 'wecandoo',
    },
    {
      author: 'jacky l',
      displayDate: '07/03/2026',
      timestamp: new Date('2026-03-07').getTime(),
      rating: 5,
      text: 'Atelier qui m\'a bien plu, explications de base claires, pour mener à des pratiques techniques efficaces pour la découverte des fromages italiens pour le néophyte. Encadrement parfait. Laboratoire très propre, bien éclairé, spacieux. J\'ai bien apprécié la possibilité de ramener le devoir à la maison pour un autre moment de partage. Bon courage, continuez, c\'est très bien.',
      source: 'wecandoo',
    },
    {
      author: 'Léa T',
      displayDate: '27/02/2026',
      timestamp: new Date('2026-02-27').getTime(),
      rating: 5,
      text: 'Très sympathique et informatif. On apprend plein de choses et avec une femme passionnée. Je recommande :)',
      source: 'wecandoo',
    },
    {
      author: 'Cyril H',
      displayDate: '21/02/2026',
      timestamp: new Date('2026-02-21').getTime(),
      rating: 5,
      text: 'Atelier tres sympa et original. La preparation de la mozza est technique mais accessible a tous. Claire anime avec simplicité pour un bon moment convivial. La boutique est pleine de produits appetissants.',
      source: 'wecandoo',
    },
    {
      author: 'Elise D',
      displayDate: '10/02/2026',
      timestamp: new Date('2026-02-10').getTime(),
      rating: 5,
      text: `Un atelier mozzarella et burrata au top, avec une ambiance chaleureuse et des explications très intéressantes sur l'histoire de la boutique, les produits locaux et la fabrication. Une expérience super sympa à refaire à la maison. En bonus, ce serait génial de pouvoir repartir avec la recette ou un petit kit pour prolonger l'expérience chez soi. Un grand merci !`,
      source: 'wecandoo',
    },
    {
      author: 'Marine H',
      displayDate: '07/01/2026',
      timestamp: new Date('2026-01-07').getTime(),
      rating: 5,
      text: `L'atelier était génial ! Claire est très gentille, pédagogue, elle choisit que des produits quali, on apprend plein de choses. La confection est trop sympa à faire, un bon moment de partage. On repart avec notre mozzarella et burrata, et c'est vraiment excellent !`,
      source: 'wecandoo',
    },
    {
      author: 'Anne F',
      displayDate: '07/01/2026',
      timestamp: new Date('2026-01-07').getTime(),
      rating: 5,
      text: 'Nous avons passé une très bonne soirée, pleine d\'information sur le lait, la nutrition et surtout le juste prix de l\'alimentation. En plus des idée recette pour manger cette délicieuse mozzarella.',
      source: 'wecandoo',
    },
    {
      author: 'Fanny m',
      displayDate: '10/12/2025',
      timestamp: new Date('2025-12-10').getTime(),
      rating: 5,
      text: 'Excellente expérience, c\'est bien d\'être gourmand mais découvrir le produit de l\'intérieur c\'est encore mieux. Claire est super sympa, l\'ambiance était bienveillante. N\'hésitez pas !',
      source: 'wecandoo',
    },
    {
      author: 'Clément',
      displayDate: '01/12/2025',
      timestamp: new Date('2025-12-01').getTime(),
      rating: 5,
      text: 'Une belle expérience en compagnie de Claire qui a su nous transmettre sa passion pour la burrata ! Merci pour ce bon moment de convivialité, on se régale !',
      source: 'wecandoo',
    },
    {
      author: 'Kilian A',
      displayDate: '30/11/2025',
      timestamp: new Date('2025-11-30').getTime(),
      rating: 5,
      text: 'Claire est une passionnée passionnante, je vous conseille vraiment son atelier. Après des bases théoriques et très interessantes, passez à la pratique et repartez avec vos créations !',
      source: 'wecandoo',
    },
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

  get displayedReviews(): ReviewItem[] {
    const sorted = [...this.reviews].sort((a, b) => b.timestamp - a.timestamp);
    return this.showAllReviews ? sorted : sorted.slice(0, 3);
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
        this.router.navigate(['/reservation/details']);
      })
    );
  }

  giftWorkshop(): void {
    if (!this.workshop) return;

    const totalPrice = this.workshop.pricePerPerson;

    const draft: ReservationDraft = {
      workshopSlug: this.workshop.slug,
      workshopTitle: this.workshop.title,
      sessionId: '',
      startAt: '',
      endAt: '',
      qty: 1,
      unitPrice: this.workshop.pricePerPerson,
      totalPrice,
      seatsLeft: this.workshop.participantsMax || 10,
      capacity: this.workshop.participantsMax || 10,
      booked: 0,
      summary: '',
      promoCode: this.referralPromoService.getCode() || '',
      discountPercent: 0,
      discountAmount: 0,
      finalTotal: totalPrice,
      isGift: true,
      isBookLater: true,
    };

    this.reservationDraftService.setDraft(draft);
    this.router.navigate(['/reservation/details']);
  }

  bookLaterWorkshop(): void {
    if (!this.workshop) return;

    const totalPrice = this.workshop.pricePerPerson;

    const draft: ReservationDraft = {
      workshopSlug: this.workshop.slug,
      workshopTitle: this.workshop.title,
      sessionId: '',
      startAt: '',
      endAt: '',
      qty: 1,
      unitPrice: this.workshop.pricePerPerson,
      totalPrice,
      seatsLeft: this.workshop.participantsMax || 10,
      capacity: this.workshop.participantsMax || 10,
      booked: 0,
      summary: '',
      promoCode: this.referralPromoService.getCode() || '',
      discountPercent: 0,
      discountAmount: 0,
      finalTotal: totalPrice,
      isBookLater: true,
    };

    this.reservationDraftService.setDraft(draft);
    this.router.navigate(['/reservation/details']);
  }

  privatizeWorkshop(): void {
    if (!this.workshop) return;

    const draft: ReservationDraft = {
      workshopSlug: this.workshop.slug,
      workshopTitle: this.workshop.title,
      sessionId: '',
      startAt: '',
      endAt: '',
      qty: 8,
      unitPrice: 50,
      totalPrice: 400,
      finalTotal: 400,
      seatsLeft: 0,
      capacity: 0,
      booked: 0,
      summary: '',
      promoCode: '',
      discountPercent: 0,
      discountAmount: 0,
      isGift: false,
      isPrivatized: true,
      customerType: 'particulier',
      participantsCount: 8,
      privatizationBasePrice: 0,
      privatizationIncludedParticipants: 10,
      privatizationExtraPricePerPerson: 50,
      proposedSlots: [],
      wantsInvoice: false,
      invoiceEmail: '',
      companyName: '',
      companyVatNumber: '',
      companySiret: '',
    };

    this.reservationDraftService.setDraft(draft);
    this.router.navigate(['/privatisation']);
  }

  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  leaveReview(): void {
    const ref = this.dialog.open(ReviewDialogComponent, {
      width: '720px',
      maxWidth: '95vw',
      panelClass: 'burdigala-dialog',
    });

    this.sub.add(
      ref.afterClosed().subscribe((result: ReviewDialogResult) => {
        if (!result) return;

        const author = `${result.firstName} ${result.lastName.charAt(0)}`;
        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, '0');
        const month = `${now.getMonth() + 1}`.padStart(2, '0');
        const year = now.getFullYear();

        const newReview: ReviewItem = {
          author,
          displayDate: `${day}/${month}/${year}`,
          timestamp: now.getTime(),
          rating: result.rating,
          text: result.text,
        };

        this.reviews = [newReview, ...this.reviews];
        this.showAllReviews = false;
      })
    );
  }

  getInitial(author: string): string {
    return author?.charAt(0)?.toUpperCase() || 'A';
  }
}
