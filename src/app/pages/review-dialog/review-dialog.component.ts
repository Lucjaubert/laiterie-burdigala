import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export type ReviewDialogResult = {
  firstName: string;
  lastName: string;
  rating: number;
  text: string;
} | null;

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss'],
})
export class ReviewDialogComponent {
  firstName = '';
  lastName = '';
  rating = 5;
  text = '';
  formError: string | null = null;

  stars = [1, 2, 3, 4, 5];

  constructor(
    private dialogRef: MatDialogRef<ReviewDialogComponent, ReviewDialogResult>
  ) {}

  setRating(value: number): void {
    this.rating = value;
  }

  submit(): void {
    this.formError = null;

    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.formError = 'Veuillez renseigner votre prénom et votre nom.';
      return;
    }

    if (!this.text.trim()) {
      this.formError = 'Veuillez renseigner votre avis.';
      return;
    }

    this.dialogRef.close({
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      rating: this.rating,
      text: this.text.trim(),
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
