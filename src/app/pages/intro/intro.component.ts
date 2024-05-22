import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class IntroComponent implements OnInit {
  isHomepage = false;

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    setTimeout(() => {
      const textElement = this.el.nativeElement.querySelector('#introText');
      this.renderer.addClass(textElement, 'text-visible');

      setTimeout(() => {
        this.router.navigate(['/accueil']);
      }, 4000);  

    }, 1000);  
  }
}
