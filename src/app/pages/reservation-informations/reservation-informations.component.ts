import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ReservationDraft } from 'src/app/models/reservation.model';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';

@Component({
  selector: 'app-reservation-informations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation-informations.component.html',
  styleUrls: ['./reservation-informations.component.scss'],
})
export class ReservationInformationsComponent implements OnInit {
  draft: ReservationDraft | null = null;

  firstName = '';
  lastName = '';
  email = '';
  billingAddress1 = '';
  billingAddress2 = '';
  billingPostalCode = '';
  billingCity = '';

  giftRecipientFirstName = '';
  giftRecipientLastName = '';
  giftRecipientEmail = '';
  giftMessage = '';

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

    this.firstName = existingDraft.firstName || '';
    this.lastName = existingDraft.lastName || '';
    this.email = existingDraft.email || '';
    this.billingAddress1 = existingDraft.billingAddress1 || '';
    this.billingAddress2 = existingDraft.billingAddress2 || '';
    this.billingPostalCode = existingDraft.billingPostalCode || '';
    this.billingCity = existingDraft.billingCity || '';

    this.giftRecipientFirstName = existingDraft.giftRecipientFirstName || '';
    this.giftRecipientLastName = existingDraft.giftRecipientLastName || '';
    this.giftRecipientEmail = existingDraft.giftRecipientEmail || '';
    this.giftMessage = existingDraft.giftMessage || '';
  }

  get hasAppliedPromo(): boolean {
    if (!this.draft) return false;
    return Number(this.draft.discountAmount || 0) > 0 || Number(this.draft.discountPercent || 0) > 0;
  }

  get displayedFinalTotal(): number {
    if (!this.draft) return 0;
    return Number(this.draft.finalTotal || this.draft.totalPrice || 0);
  }

  get isGift(): boolean {
    return !!this.draft?.isGift;
  }

  goBack(): void {
    this.persistDraft();
    this.router.navigate(['/reservation/details']);
  }

  continue(): void {
    if (!this.draft) return;

    this.formError = null;

    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim()) {
      this.formError = 'Veuillez renseigner vos nom, prénom et email.';
      return;
    }

    if (!this.billingAddress1.trim() || !this.billingPostalCode.trim() || !this.billingCity.trim()) {
      this.formError = 'Veuillez renseigner votre adresse de facturation complète.';
      return;
    }

    if (this.isGift) {
      if (
        !this.giftRecipientFirstName.trim() ||
        !this.giftRecipientLastName.trim() ||
        !this.giftRecipientEmail.trim()
      ) {
        this.formError = 'Veuillez renseigner le prénom, le nom et l’email du bénéficiaire.';
        return;
      }
    }

    const updatedDraft = this.persistDraft();

    console.log('Draft informations mis à jour :', updatedDraft);
    this.router.navigate(['/reservation/paiement']);
  }

  private persistDraft(): ReservationDraft {
    if (!this.draft) {
      throw new Error('Aucun draft de réservation disponible.');
    }

    const senderFullName = `${this.firstName.trim()} ${this.lastName.trim()}`.trim();

    const updatedDraft: ReservationDraft = {
      ...this.draft,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      billingAddress1: this.billingAddress1.trim(),
      billingAddress2: this.billingAddress2.trim(),
      billingPostalCode: this.billingPostalCode.trim(),
      billingCity: this.billingCity.trim(),
      giftRecipientFirstName: this.isGift ? this.giftRecipientFirstName.trim() : '',
      giftRecipientLastName: this.isGift ? this.giftRecipientLastName.trim() : '',
      giftRecipientEmail: this.isGift ? this.giftRecipientEmail.trim() : '',
      giftMessage: this.isGift ? this.giftMessage.trim() : '',
      giftSenderName: this.isGift ? senderFullName : '',
      finalTotal: this.draft.finalTotal || this.draft.totalPrice,
    };

    this.draft = updatedDraft;
    this.reservationDraftService.setDraft(updatedDraft);

    return updatedDraft;
  }
}
