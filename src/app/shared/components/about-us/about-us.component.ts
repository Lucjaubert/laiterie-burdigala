import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WordpressService } from 'src/app/scripts/wordpress.service';

interface AboutUsData {
  title: string;
  content: string;
  acf_fields: {
    "about-us": string;
    "text-1": string;
    "text-2": string;
    "text-3": string;
  };
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AboutUsComponent implements OnInit {
  aboutUsData$: Observable<AboutUsData[]>;

  constructor(private wpService: WordpressService) {
    this.aboutUsData$ = this.wpService.getAboutUs();
  }

  ngOnInit(): void {}
}