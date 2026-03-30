import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationDraft } from 'src/app/models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationDraftService {
  private readonly storageKey = 'burdigala_reservation_draft';
  private readonly draftSubject = new BehaviorSubject<ReservationDraft | null>(this.readFromStorage());

  get draft$(): Observable<ReservationDraft | null> {
    return this.draftSubject.asObservable();
  }

  getDraft(): ReservationDraft | null {
    return this.draftSubject.value;
  }

  setDraft(draft: ReservationDraft): void {
    this.draftSubject.next(draft);
    this.writeToStorage(draft);
  }

  clearDraft(): void {
    this.draftSubject.next(null);
    this.removeFromStorage();
  }

  private readFromStorage(): ReservationDraft | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as ReservationDraft;
    } catch (error) {
      console.error('Erreur lecture draft réservation depuis sessionStorage :', error);
      return null;
    }
  }

  private writeToStorage(draft: ReservationDraft): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(draft));
    } catch (error) {
      console.error('Erreur sauvegarde draft réservation dans sessionStorage :', error);
    }
  }

  private removeFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Erreur suppression draft réservation dans sessionStorage :', error);
    }
  }
}
