export interface ReservationDraft {
  workshopSlug: string;
  workshopTitle: string;
  sessionId: string;
  startAt: string;
  endAt: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  seatsLeft: number;
  capacity?: number;
  booked?: number;
  summary?: string;

  phone?: string;
  isGift?: boolean;

  giftRecipientFirstName?: string;
  giftRecipientLastName?: string;
  giftRecipientEmail?: string;
  giftMessage?: string;
  giftSenderName?: string;

  firstName?: string;
  lastName?: string;
  email?: string;

  billingAddress1?: string;
  billingAddress2?: string;
  billingPostalCode?: string;
  billingCity?: string;

  promoCode?: string;
  discountPercent?: number;
  discountAmount?: number;
  finalTotal?: number;
  cgvAccepted?: boolean;
}
