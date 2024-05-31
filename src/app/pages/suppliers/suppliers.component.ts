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
      this.animateImages(imgList);
    });
  }

  generateArray(fields: any): number[] {
    const keys = Object.keys(fields);
    const supplierNumbers = keys.filter(key => key.startsWith('supplier-') && !key.includes('-image'))
                                 .map(key => parseInt(key.split('-')[1]));
    return supplierNumbers;
  }

  animateImages(imgList: QueryList<ElementRef>): void {
    imgList.forEach(img => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const x = direction * (100 + Math.random() * 50); 
      const y = direction * (100 + Math.random() * 50); 
      gsap.fromTo(img.nativeElement, { opacity: 0, x, y }, { opacity: 1, x: 0, y: 0, duration: 1.5, ease: 'power3.out' });
    });
  }

  handleImageError(event: any): void {
    console.error("Image load error: ", event);
    event.target.style.display = 'none';
  }
}