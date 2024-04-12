import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class IntroComponent implements OnInit {

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Rendre le texte visible après 2 secondes
    setTimeout(() => {
      const textElement = this.el.nativeElement.querySelector('#introText');
      this.renderer.addClass(textElement, 'text-visible');

      // Rediriger vers la page 'accueil' après un total de 5 secondes (2 + 3 secondes)
      setTimeout(() => {
        this.router.navigate(['/accueil']);
      }, 3000);  // Attente supplémentaire de 3 secondes après que le texte devient visible

    }, 2000);  // Attente initiale de 2 secondes pour l'animation du texte
  }
}
