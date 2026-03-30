import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StripeCheckoutRequest {
  workshopSlug: string;
  workshopTitle: string;
  sessionId: string;
  startAt: string;
  endAt: string;

  qty: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount: number;
  finalTotal: number;
  promoCode?: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  billingAddress1: string;
  billingAddress2?: string;
  billingPostalCode: string;
  billingCity: string;

  isGift?: boolean;
  giftRecipientFirstName?: string;
  giftRecipientLastName?: string;
  giftRecipientEmail?: string;
  giftMessage?: string;
  giftSenderName?: string;
}

export interface StripeCheckoutResponse {
  success: boolean;
  message: string;
  mode?: string;
  publishableKeyConfigured?: boolean;
  secretKeyConfigured?: boolean;
  successUrl?: string;
  cancelUrl?: string;
  checkoutReady?: boolean;
  baseTotal?: number;
  discountAmount?: number;
  finalTotal?: number;
  payloadPreview?: StripeCheckoutRequest;
  checkoutUrl?: string;
  sessionId?: string;
  publishableKey?: string;
  stripeError?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private readonly url = '/wp-json/burdigala/v1/stripe/create-checkout-session';

  constructor(private http: HttpClient) {}

  createCheckoutSession(payload: StripeCheckoutRequest): Observable<StripeCheckoutResponse> {
    return this.http.post<StripeCheckoutResponse>(this.url, payload);
  }

  redirectToCheckout(checkoutUrl?: string): void {
    if (!checkoutUrl) {
      throw new Error('checkoutUrl absente dans la réponse Stripe.');
    }

    window.location.href = checkoutUrl;
  }
}
