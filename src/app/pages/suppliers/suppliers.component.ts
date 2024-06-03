import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { gsap } from 'gsap';
import { WordpressService } from 'src/app/services/wordpress.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SupplierData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    subtitle: string;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SuppliersComponent implements OnInit, AfterViewInit {
  @ViewChildren('fadeInImage', { read: ElementRef }) images!: QueryList<ElementRef>;
  suppliersData$: Observable<SupplierData[]>;

  constructor(private wpService: WordpressService) {
    this.suppliersData$ = this.wpService.getSuppliers().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des fournisseurs:', error);
        return of([]);
      })
    );
  }

  ngOnInit(): void {
    this.suppliersData$.subscribe(() => {
      setTimeout(() => {
        this.animateImagesOnLoad();
      }, 0);
    });
  }

  ngAfterViewInit(): void {
    this.images.changes.subscribe(imgList => {
      this.customAnimateImages(imgList);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.customAnimateImages(this.images);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  animateImagesOnLoad(): void {
    this.images.forEach((img, index) => {
      let yStart: number = 0;

      switch (index % 3) {
        case 0:
          yStart = -100;
          break;
        case 1:
          yStart = 100;
          break;
        case 2:
          yStart = -100;
          break;
      }

      gsap.fromTo(img.nativeElement, { y: yStart, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out' });
    });
  }

  customAnimateImages(imgList: QueryList<ElementRef>): void {
    const scrollY = window.scrollY;
    imgList.forEach((img, index) => {
      let yOffset: number = scrollY * 0.1;
      switch (index % 3) {
        case 0:
          yOffset = -30 + yOffset;
          break;
        case 1:
          yOffset = 30 + yOffset;
          break;
        case 2:
          yOffset = -30 + yOffset;
          break;
      }

      gsap.to(img.nativeElement, { y: yOffset, duration: 1.5, ease: 'power3.out' });
    });
  }

  handleImageError(event: any): void {
    console.error("Image load error: ", event);
    event.target.style.display = 'none';
  }
}
