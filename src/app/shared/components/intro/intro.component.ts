import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class IntroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
