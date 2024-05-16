import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuBurgerLogoComponent } from '../menu-burger-logo/menu-burger-logo.component';
import { MenuStateService } from 'src/app/services/menustate.service';
import { TransitionService } from 'src/app/services/transition.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showHeader = this.router.url !== '/';
    });

    // Abonnez-vous à la fin de la transition
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
      await this.animateOut(); // Attendre que l'animation de fermeture se termine
      this.transitionService.startTransition();

      this.router.navigateByUrl(item.link).then(() => {
        // Nous n'appelons plus closeMenu ici car il sera appelé après la transition
      });
    }
  }

  expandHeader(): void {
    if (this.headerContainer) {
      gsap.to(this.headerContainer.nativeElement, {
        width: '100vw',
        duration: 1,
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
