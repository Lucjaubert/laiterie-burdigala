import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ReservationDraft } from 'src/app/models/reservation.model';
import { ReservationDraftService } from 'src/app/services/reservation-draft.service';

@Component({
  selector: 'app-privatization-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './privatization-request.component.html',
  styleUrls: ['./privatization-request.component.scss'],
})
export class PrivatizationRequestComponent implements OnInit {
  draft: ReservationDraft | null = null;

  customerType: 'particulier' | 'entreprise' = 'particulier';
  participantsCount = 8;

  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  companyName = '';

  wantsInvoice = false;
  requestMessage = '';

  formError: string | null = null;

  constructor(
    private router: Router,
    private reservationDraftService: ReservationDraftService
  ) {}

  ngOnInit(): void {
    const existingDraft = this.reservationDraftService.getDraft();

    if (!existingDraft || !existingDraft.isPrivatized) {
      this.router.navigate(['/nos-ateliers']);
      return;
    }

    this.draft = { ...existingDraft };
    this.customerType = existingDraft.customerType === 'entreprise' ? 'entreprise' : 'particulier';
    this.participantsCount = existingDraft.participantsCount || 8;

    this.firstName = existingDraft.firstName || '';
    this.lastName = existingDraft.lastName || '';
    this.phone = existingDraft.phone || '';
    this.email = existingDraft.email || '';
    this.companyName = existingDraft.companyName || '';
    this.wantsInvoice = !!existingDraft.wantsInvoice;
    this.requestMessage = existingDraft.summary || '';
  }

  get unitPrice(): number {
    return 50;
  }

  get privatizationFee(): number {
    return this.participantsCount >= 5 && this.participantsCount <= 7 ? 200 : 0;
  }

  get computedTotal(): number {
    return (this.participantsCount * this.unitPrice) + this.privatizationFee;
  }

  get displayCustomerType(): string {
    return this.customerType === 'entreprise' ? 'Entreprise' : 'Particulier';
  }

  get participantsText(): string {
    return `${this.participantsCount} participant${this.participantsCount > 1 ? 's' : ''}`;
  }

  get suggestedMessage(): string {
    return `Durée : comme les ateliers classiques ou à définir ensemble selon devis
Jours : à définir ensemble
Heure de démarrage : idem

Cela dépend du taux d’occupation du labo, de la saison, etc.`;
  }

  decreaseParticipants(): void {
    if (this.participantsCount <= 5) {
      return;
    }

    this.participantsCount--;
    this.persistDraft();
  }

  increaseParticipants(): void {
    this.participantsCount++;
    this.persistDraft();
  }

  setCustomerType(type: 'particulier' | 'entreprise'): void {
    this.customerType = type;
    this.persistDraft();
  }

  fillSuggestedMessage(): void {
    this.requestMessage = this.suggestedMessage;
    this.persistDraft();
  }

  goBack(): void {
    this.persistDraft();
    this.router.navigate(['/nos-ateliers', this.draft?.workshopSlug]);
  }

  continue(): void {
    if (!this.draft) return;

    this.formError = null;

    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.formError = 'Veuillez renseigner votre prénom et votre nom.';
      return;
    }

    if (!this.phone.trim() || !this.email.trim()) {
      this.formError = 'Veuillez renseigner votre téléphone et votre email.';
      return;
    }

    if (this.customerType === 'entreprise' && !this.companyName.trim()) {
      this.formError = 'Veuillez renseigner le nom de l’entreprise.';
      return;
    }

    if (this.participantsCount < 5) {
      this.formError = 'La privatisation est possible à partir de 5 participants.';
      return;
    }

    if (!this.requestMessage.trim()) {
      this.formError = 'Veuillez préciser votre demande de créneaux et d’organisation.';
      return;
    }

    this.persistDraft();
    this.router.navigate(['/reservation/informations']);
  }

  private persistDraft(): ReservationDraft {
    if (!this.draft) {
      throw new Error('Aucun draft de privatisation disponible.');
    }

    const updatedDraft: ReservationDraft = {
      ...this.draft,
      isPrivatized: true,
      isGift: false,
      customerType: this.customerType,
      participantsCount: this.participantsCount,
      qty: this.participantsCount,
      unitPrice: this.unitPrice,
      totalPrice: this.computedTotal,
      finalTotal: this.computedTotal,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      phone: this.phone.trim(),
      email: this.email.trim(),
      companyName: this.customerType === 'entreprise' ? this.companyName.trim() : '',
      wantsInvoice: this.wantsInvoice,
      invoiceEmail: this.wantsInvoice ? this.email.trim() : '',
      summary: this.requestMessage.trim(),
      proposedSlots: [],
    };

    this.draft = updatedDraft;
    this.reservationDraftService.setDraft(updatedDraft);

    return updatedDraft;
  }
}
