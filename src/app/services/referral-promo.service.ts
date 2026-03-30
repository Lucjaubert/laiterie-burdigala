import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReferralPromoService {
  private readonly storageKey = 'burdigala_referral_promo_code';

  getCode(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const value = sessionStorage.getItem(this.storageKey);
      return value ? value.trim().toUpperCase() : null;
    } catch (error) {
      console.error('Erreur lecture referral promo depuis sessionStorage :', error);
      return null;
    }
  }

  setCode(code: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const normalizedCode = (code || '').trim().toUpperCase();
    if (!normalizedCode) {
      return;
    }

    try {
      sessionStorage.setItem(this.storageKey, normalizedCode);
    } catch (error) {
      console.error('Erreur sauvegarde referral promo dans sessionStorage :', error);
    }
  }

  clearCode(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      sessionStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Erreur suppression referral promo depuis sessionStorage :', error);
    }
  }

  captureFromQueryParam(code: string | null | undefined): void {
    const normalizedCode = (code || '').trim().toUpperCase();

    if (!normalizedCode) {
      return;
    }

    this.setCode(normalizedCode);
  }
}
