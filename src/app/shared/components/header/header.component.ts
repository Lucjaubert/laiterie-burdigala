import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';
import { MenuStateService } from 'src/app/services/menustate.service';
import { TransitionService } from 'src/app/services/transition.service';
import { filter } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, MenuBurgerLogoComponent, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isHomepage: boolean = true;
  navbarExpanded: boolean = false;
  showHeader: boolean = false;
  showCartIcon: boolean = false;
  totalItemCount$: Observable<number>;

  @Output() menuItemClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() toggleMenuState: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('headerContainer') headerContainer!: ElementRef<HTMLDivElement>;

  private subscription: Subscription = new Subscription();
  menuItems = [
    { label: "Nos produits", link: "/nos-produits" },
    { label: "Nos ateliers", link: "/nos-ateliers" },
    { label: "Notre brunch", link: "/notre-brunch" },
    { label: "Nos fournisseurs", link: "/nos-fournisseurs" },
    { label: "À propos de nous", link: "/a-propos-de-nous" }
  ];

  constructor(
    private menuStateService: MenuStateService,
    private transitionService: TransitionService,
    private router: Router,
    private cartService: CartService
  ) {
    this.totalItemCount$ = this.cartService.getTotalItemCount();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.showHeader = this.router.url !== '/';
      this.isHomepage = this.router.url === '/accueil';
      const cartVisibleUrls = [
        '/accueil', '/nos-produits', '/finaliser-commande', '/nos-ateliers',
        '/notre-brunch', '/nos-fournisseurs', '/a-propos-de-nous'
      ];
      this.showCartIcon = cartVisibleUrls.includes(event.url);
    });

    this.subscription.add(
      this.transitionService.transitionDone$.subscribe(done => {
        if (done) {
          this.closeMenu();
        }
      })
    );
  }

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
    this.menuStateService.toggleMenu(this.navbarExpanded);
    this.toggleMenuState.emit(this.navbarExpanded);
    if (this.navbarExpanded) {
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  animateIn(): void {
    gsap.from('.navigation-elements', {
      x: '-100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
    gsap.to('.navigation-elements', {
      x: '0%',
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.5
    });
  }

  animateOut(): Promise<void> {
    return new Promise<void>((resolve) => {
      gsap.to('.navigation-elements', {
        x: '-100%',
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => resolve()
      });
    });
  }

  async handleNavItemClick(event: MouseEvent, item: any): Promise<void> {
    event.preventDefault();
    if (this.router.url !== item.link) {
      this.menuStateService.setCurrentRoute(item.link);
      await this.animateOut(); 
      this.transitionService.startTransition();

      this.router.navigateByUrl(item.link).then(() => {
      });
    }
  }

  expandHeader(): void {
    if (this.headerContainer) {
      gsap.to(this.headerContainer.nativeElement, {
        width: '100vw',
        duration: 1.5,
        ease: 'power3.inOut'
      });
    }
  }

  closeMenu(): void {
    this.navbarExpanded = false;
    this.toggleMenuState.emit(this.navbarExpanded);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
