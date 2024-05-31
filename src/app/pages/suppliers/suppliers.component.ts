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

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.images.changes.subscribe(imgList => {
      this.customAnimateImages(imgList);
    });
  }

  customAnimateImages(imgList: QueryList<ElementRef>): void {
    imgList.forEach((img, index) => {
      const section = img.nativeElement.closest('.supplier-section');
      let xStart: number = 0;  
      let yStart: number = 0; 
  
      if (section.classList.contains('supplier-1')) {
        switch (index % 3) {
          case 0:
            xStart = -300;  
            yStart = 0;
            break;
          case 1:
            xStart = 0;     
            yStart = -300;
            break;
          case 2:
            xStart = 300;   
            yStart = 0;
            break;
        }
      } else if (section.classList.contains('supplier-2')) {
        switch (index % 3) {
          case 0:
            xStart = 0;    
            yStart = 300;
            break;
          case 1:
            xStart = -300;  
            yStart = 0;
            break;
          case 2:
            xStart = 300;   
            yStart = 0;
            break;
        }
      } else if (section.classList.contains('supplier-3')) {
        switch (index % 3) {
          case 0:
            xStart = 0;     
            yStart = -300;
            break;
          case 1:
            xStart = 0;     
            yStart = 300;
            break;
          case 2:
            xStart = 300;  
            yStart = 0;
            break;
        }
      } else if (section.classList.contains('supplier-4')) {
        switch (index % 3) {
          case 0:
            xStart = -300;  
            yStart = 0;
            break;
          case 1:
            xStart = 300;  
            yStart = 0;
            break;
          case 2:
            xStart = 0;     
            yStart = -300;
            break;
        }
      } else if (section.classList.contains('supplier-5')) {
        switch (index % 3) {
          case 0:
            xStart = 0;    
            yStart = 300;
            break;
          case 1:
            xStart = -300; 
            yStart = 0;
            break;
          case 2:
            xStart = 0;    
            yStart = -300;
            break;
        }
      }
  
      gsap.fromTo(img.nativeElement, { opacity: 0, x: xStart, y: yStart }, { opacity: 1, x: 0, y: 0, duration: 1.5, ease: 'power3.out' });
    });
  }
  

  handleImageError(event: any): void {
    console.error("Image load error: ", event);
    event.target.style.display = 'none';
  }
}
