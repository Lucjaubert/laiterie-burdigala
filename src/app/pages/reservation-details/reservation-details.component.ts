import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ReservationDraft } from 'src/app/models/reservation.model';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';

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
  formError: string | null = null;

  constructor(
    private router: Router,
    private reservationDraftService: ReservationDraftService
  ) {}

  ngOnInit(): void {
    const existingDraft = this.reservationDraftService.getDraft();

    if (!existingDraft) {
      this.router.navigate(['/nos-ateliers']);
      return;
    }

    this.draft = { ...existingDraft };
    this.qty = existingDraft.qty || 1;
    this.phone = existingDraft.phone || '';
    this.isGift = !!existingDraft.isGift;
  }

  get availableQtyOptions(): number[] {
    const maxSeats = this.draft?.seatsLeft ?? 1;
    const max = Math.max(1, Math.min(maxSeats, 10));
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  get totalPrice(): number {
    if (!this.draft) return 0;
    return this.qty * this.draft.unitPrice;
  }

  onQtyChange(): void {
    if (!this.draft) return;

    this.draft = {
      ...this.draft,
      qty: this.qty,
      totalPrice: this.totalPrice,
    };

    this.reservationDraftService.setDraft(this.draft);
  }

  goBack(): void {
    window.history.back();
  }

  continue(): void {
    if (!this.draft) return;

    this.formError = null;

    if (!this.phone.trim()) {
      this.formError = 'Veuillez renseigner votre numéro de téléphone.';
      return;
    }

    const updatedDraft: ReservationDraft = {
      ...this.draft,
      qty: this.qty,
      totalPrice: this.totalPrice,
      phone: this.phone,
      isGift: this.isGift,
    };

    this.reservationDraftService.setDraft(updatedDraft);

    console.log('Draft réservation mis à jour :', updatedDraft);

    this.router.navigate(['/reservation/informations']);
  }
}
