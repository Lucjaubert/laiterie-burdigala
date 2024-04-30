import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-burger-logo',
  templateUrl: './menu-burger-logo.component.html',
  styleUrls: ['./menu-burger-logo.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MenuBurgerLogoComponent {
  @Input() isHomepage: boolean = false; 
  @Input() showToggle: boolean = true;
  @Output() toggle = new EventEmitter<boolean>();
  navbarExpanded: boolean = false;

  toggleMenu(): void {
    // Inverse l'état du menu burger
    this.navbarExpanded = !this.navbarExpanded;

    // Émettre un événement pour le composant parent pour mettre à jour son état
    this.toggle.emit(this.navbarExpanded);
  }

  closeMenu(): void {
    // Réinitialiser l'état du menu burger lorsque le menu est fermé
    this.navbarExpanded = false;
  }
}