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
  @Output() toggle = new EventEmitter<boolean>();
  @Input() navbarExpanded: boolean = false; 

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
    this.toggle.emit(this.navbarExpanded);
  }
}