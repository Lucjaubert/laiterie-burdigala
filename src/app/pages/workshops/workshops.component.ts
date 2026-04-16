import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { TransitionService } from 'src/app/services/transition.service';
import { ReferralPromoService } from 'src/app/services/referral-promo.service';
import { WORKSHOPS, WorkshopHardcoded } from 'src/app/config/workshops.config';

@Component({
  selector: 'app-workshops',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss'],
})
export class WorkshopsComponent implements OnInit, OnDestroy {
  isHomepage = false;
  workshops: WorkshopHardcoded[] = WORKSHOPS;

  private transitionSub?: Subscription;
  private queryParamsSub?: Subscription;

  constructor(
    private transitionService: TransitionService,
    private route: ActivatedRoute,
    private referralPromoService: ReferralPromoService
  ) {}

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParamMap.subscribe((params) => {
      const promoCode = params.get('promo');

      if (promoCode) {
        this.referralPromoService.captureFromQueryParam(promoCode);
        console.log('Code promo referral détecté dans URL :', promoCode);
      }
    });

    this.transitionSub = this.transitionService.transitionDone$.subscribe((done) => {
      if (done) {
        this.animateCards();
      }
    });
  }

  ngOnDestroy(): void {
    this.transitionSub?.unsubscribe();
    this.queryParamsSub?.unsubscribe();
  }

  private animateCards(): void {
    gsap.fromTo(
      '.workshop-card',
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        clearProps: 'transform,opacity',
      }
    );

    gsap.fromTo(
      '.page-title',
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
  }
}
