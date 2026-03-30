import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import { WorkshopSlug } from 'src/app/config/workshops.config';
import {
  WorkshopSlotsService,
  WorkshopSession
} from 'src/app/services/workshop-slots.service';

type DialogData = {
  workshopSlug: WorkshopSlug;
  workshopTitle: string;
};

@Component({
  selector: 'app-workshop-availability-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './workshop-availability-dialog.component.html',
  styleUrls: ['./workshop-availability-dialog.component.scss'],
})
export class WorkshopAvailabilityDialogComponent implements OnInit {
  isLoading = false;
  errorMsg: string | null = null;

  sessions: WorkshopSession[] = [];
  selectedDate: Date | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<WorkshopAvailabilityDialogComponent>,
    private workshopSlotsService: WorkshopSlotsService
  ) {}

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.loadSlots();
  }

  private loadSlots(): void {
    this.isLoading = true;
    this.errorMsg = null;

    const from = new Date();
    const to = new Date();
    to.setMonth(to.getMonth() + 6);

    this.workshopSlotsService.getSlots(this.data.workshopSlug, from, to).subscribe({
      next: (slots) => {
        const now = new Date();

        this.sessions = [...slots]
          .filter((slot) => {
            const start = new Date(slot.startAt);
            return !isNaN(start.getTime()) && start.getTime() > now.getTime();
          })
          .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

        const nextAvailable = this.sessions.find((s) => s.seatsLeft > 0) ?? this.sessions[0] ?? null;
        this.selectedDate = nextAvailable ? new Date(nextAvailable.startAt) : null;

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement disponibilités :', error);
        this.errorMsg = 'Impossible de charger les disponibilités.';
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onDateChange(date: Date | null): void {
    if (!date) return;
    this.selectedDate = date;
  }

  get sessionsForSelectedDate(): WorkshopSession[] {
    if (!this.selectedDate) return [];

    const y = this.selectedDate.getFullYear();
    const m = this.selectedDate.getMonth();
    const d = this.selectedDate.getDate();

    return this.sessions.filter((s) => {
      const dt = new Date(s.startAt);
      return (
        dt.getFullYear() === y &&
        dt.getMonth() === m &&
        dt.getDate() === d
      );
    });
  }

  dateClass = (date: Date): string => {
    const hasAny = this.sessions.some((s) => {
      const dt = new Date(s.startAt);
      return (
        dt.getFullYear() === date.getFullYear() &&
        dt.getMonth() === date.getMonth() &&
        dt.getDate() === date.getDate()
      );
    });

    if (!hasAny) {
      return '';
    }

    const hasSeats = this.sessions.some((s) => {
      const dt = new Date(s.startAt);
      return (
        dt.getFullYear() === date.getFullYear() &&
        dt.getMonth() === date.getMonth() &&
        dt.getDate() === date.getDate() &&
        s.seatsLeft > 0
      );
    });

    return hasSeats ? 'cal-has-availability' : 'cal-full';
  };

  reserve(session: WorkshopSession): void {
    if (session.seatsLeft <= 0) return;

    console.log('reserve session', session);
    this.dialogRef.close({ session });
  }
}
