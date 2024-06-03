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

  // Stockez les positions initiales des images
  initialPositions: Map<ElementRef, number> = new Map();

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
        // Stockez les positions initiales après le chargement des images
        this.storeInitialPositions();
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
      // Calculer le décalage en fonction de la position de l'image dans la rangée
      let yOffset = 0;
      switch (index % 3) {
        case 0: // Image à gauche
          yOffset = 1000; // Descendre de 20 pixels
          break;
        case 1: // Image au centre
          yOffset = -1000; // Monter de 20 pixels
          break;
        case 2: // Image à droite
          yOffset = 1000; // Descendre de 20 pixels
          break;
      }
  
      // Animer l'image pour bouger en fonction du défilement
      gsap.to(img.nativeElement, { y: yOffset, duration: 2, ease: 'power3.out' });
  
      // Réinitialiser la position initiale de l'image après le défilement
      setTimeout(() => {
        gsap.to(img.nativeElement, { y: 0, duration: 2, ease: 'power2.out' });
      }, 2000); // 2 secondes
    });
  }  

  handleImageError(event: any): void {
    console.error("Image load error: ", event);
    event.target.style.display = 'none';
  }
}
