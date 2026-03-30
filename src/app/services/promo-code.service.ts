import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PromoValidateRequest {
  code: string;
  qty: number;
  unitPrice: number;
  workshopSlug: string;
}

export interface PromoValidateResponse {
  valid: boolean;
  message: string;
  code?: string;
  type?: string;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  baseTotal?: number;
  finalTotal?: number;
  remainingUses?: number;
  workshopSlug?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private readonly validateUrl = '/wp-json/burdigala/v1/promo/validate';

  constructor(private http: HttpClient) {}

  validateCode(payload: PromoValidateRequest): Observable<PromoValidateResponse> {
    return this.http.post<PromoValidateResponse>(this.validateUrl, payload);
  }
}
