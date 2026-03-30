import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingDetails {
  id: number;
  stripeSessionId: string;
  paymentIntentId: string;
  workshopSlug: string;
  workshopTitle: string;
  sessionId: string;
  startAt: string;
  endAt: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  promoCode?: string | null;
  discountAmount: number;
  finalTotal: number;
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  billingAddress1?: string;
  billingAddress2?: string;
  billingPostalCode?: string;
  billingCity?: string;
  status: string;
  createdAt: string;
  referralCode?: string | null;
}

export interface BookingBySessionResponse {
  success: boolean;
  message?: string;
  booking?: BookingDetails;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly bookingBySessionUrl = '/wp-json/burdigala/v1/bookings/by-session';

  constructor(private http: HttpClient) {}

  getBookingByStripeSession(sessionId: string): Observable<BookingBySessionResponse> {
    return this.http.get<BookingBySessionResponse>(
      `${this.bookingBySessionUrl}?session_id=${encodeURIComponent(sessionId)}`
    );
  }
}
