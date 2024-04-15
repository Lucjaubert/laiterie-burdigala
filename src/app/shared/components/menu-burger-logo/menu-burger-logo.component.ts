import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu-burger-logo',
  templateUrl: './menu-burger-logo.component.html',
  styleUrls: ['./menu-burger-logo.component.scss'],
  standalone: true,
  imports: [CommonModule] 
})
export class MenuBurgerLogoComponent {
  @Output() toggle = new EventEmitter<boolean>();
  navbarExpanded: boolean = false;  

  toggleMenu(): void {
    this.navbarExpanded = !this.navbarExpanded;
    this.toggle.emit(this.navbarExpanded); 
  }
}

