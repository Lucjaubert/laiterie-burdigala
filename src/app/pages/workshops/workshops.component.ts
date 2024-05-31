import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { gsap } from 'gsap';
import { WordpressService } from 'src/app/services/wordpress.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TransitionService } from 'src/app/services/transition.service'; 

interface WorkshopData {
  title: string;
  content: string;
  acf_fields: {
    title: string;
    texte: string;
  };
}

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule]
})
export class WorkshopsComponent implements OnInit, AfterViewInit, OnDestroy {
  isHomepage = false;
  workshopsData$: Observable<WorkshopData[] | null>;
  private transitionSub: Subscription = new Subscription();

  constructor(
    private wpService: WordpressService, 
    private transitionService: TransitionService
  ) { 
    this.workshopsData$ = this.wpService.getWorkshop().pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des données de la page ateliers:', error);
        return of(null); 
      })
    );
  }

  ngOnInit(): void {
    this.subscribeToTransition();
  }

  ngAfterViewInit(): void {
    this.workshopsData$.subscribe(data => {
    });
  }

  private subscribeToTransition(): void {
    this.transitionSub = this.transitionService.transitionDone$.subscribe(done => {
      if (done) {
        this.animateElements();
      }
    });
  }

  private animateElements(): void {
    gsap.fromTo('.img-fluid-2', { x: -200, opacity: 0 }, {
      duration: 4.5,
      x: 0,
      opacity: 1,
      ease: 'power4.out'
    });

    gsap.fromTo('.img-fluid-1', { x: 200, opacity: 0 }, {
      duration: 5,
      x: 0,
      opacity: 1,
      ease: 'power4.out'
    });

    gsap.fromTo('.logo-overlay', { y: -100, opacity: 0 }, {
      duration: 5.5,
      y: 0,
      opacity: 1,
      ease: 'power4.out'
    });
  }

  ngOnDestroy(): void {
    if (this.transitionSub) {
      this.transitionSub.unsubscribe();
    }
  }

  openWecandooSite(): void {
    window.location.href = 'https://wecandoo.fr/atelier/mozzarella-artisanale-bordeaux';
  }
}
