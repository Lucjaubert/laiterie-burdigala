import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { gsap } from 'gsap';
import { WordpressService } from 'src/app/services/wordpress.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

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
  imports: [CommonModule, RouterModule, LazyLoadImageModule]
})
export class SuppliersComponent implements OnInit, AfterViewInit {
  @ViewChildren('fadeInImage', { read: ElementRef }) images!: QueryList<ElementRef>;
  suppliersData$: Observable<SupplierData[]>;

  initialPositions: Map<ElementRef, number> = new Map();

  constructor(private wpService: WordpressService, private cdRef: ChangeDetectorRef) {
    this.suppliersData$ = this.wpService.getSuppliers().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données des fournisseurs:', error);
        return of([]);
      })
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.images.changes.subscribe(() => {
      this.launchAnimations();
    });

    if (this.images.length > 0) {
      this.launchAnimations();
    }

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

  private launchAnimations(): void {
    this.cdRef.detectChanges();

    setTimeout(() => {
      this.animateImagesOnLoad();
      this.storeInitialPositions();
    }, 0);
  }

  animateImagesOnLoad(): void {
    this.images.forEach((img, index) => {
      let yStart: number = 0;

      switch (index % 3) {
        case 0:
          yStart = -10;
          break;
        case 1:
          yStart = 10;
          break;
        case 2:
          yStart = -10;
          break;
      }

      gsap.fromTo(img.nativeElement, { y: yStart, opacity: 0 }, { y: 0, opacity: 1, duration: 4.5, ease: 'power2.out' });
    });
  }

  storeInitialPositions(): void {
    this.images.forEach(img => {
      this.initialPositions.set(img, img.nativeElement.getBoundingClientRect().top);
    });
  }

  customAnimateImages(imgList: QueryList<ElementRef>): void {
    imgList.forEach((img, index) => {
      let yOffset = 0;
      switch (index % 3) {
        case 0:
          yOffset = 1000;
          break;
        case 1:
          yOffset = -1000;
          break;
        case 2:
          yOffset = 1000;
          break;
      }

      gsap.to(img.nativeElement, { y: yOffset, duration: 2, ease: 'power3.out' });
      setTimeout(() => {
        gsap.to(img.nativeElement, { y: 0, duration: 2, ease: 'power2.out' });
      }, 2000);
    });
  }

  handleImageError(event: any): void {
    console.error("Image load error: ", event);
    event.target.style.display = 'none';
  }
}


