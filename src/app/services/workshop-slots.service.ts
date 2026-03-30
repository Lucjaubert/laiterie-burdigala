import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { WorkshopSlug } from 'src/app/config/workshops.config';

export interface SlotApiItem {
  eventId: string;
  summary: string;
  startAt: string; // ISO
  endAt: string;   // ISO
  capacity?: number;
  booked?: number;
  seatsLeft?: number;
}

export interface SlotsApiResponse {
  workshop: string;
  timezone: string;
  from: string;
  to: string;
  slots: SlotApiItem[];
}

export interface WorkshopSession {
  id: string;
  workshopSlug: WorkshopSlug;
  startAt: string; // ISO
  endAt: string;   // ISO
  seatsLeft: number;
  capacity?: number;
  booked?: number;
  summary?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkshopSlotsService {
  private readonly baseUrl = '/wp-json/burdigala/v1/slots';

  constructor(private http: HttpClient) {}

  getSlots(workshopSlug: WorkshopSlug, from: Date, to: Date): Observable<WorkshopSession[]> {
    const params = new HttpParams()
      .set('workshop', workshopSlug)
      .set('from', this.formatYMD(from))
      .set('to', this.formatYMD(to));

    return this.http.get<SlotsApiResponse>(this.baseUrl, { params }).pipe(
      map((res) =>
        (res?.slots ?? []).map((s) => ({
          id: s.eventId || `${workshopSlug}-${s.startAt}`,
          workshopSlug,
          startAt: s.startAt,
          endAt: s.endAt,
          seatsLeft: typeof s.seatsLeft === 'number' ? s.seatsLeft : 10,
          capacity: typeof s.capacity === 'number' ? s.capacity : 10,
          booked: typeof s.booked === 'number' ? s.booked : 0,
          summary: s.summary,
        }))
      )
    );
  }

  private formatYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
