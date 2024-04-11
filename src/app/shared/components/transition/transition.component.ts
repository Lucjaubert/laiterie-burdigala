import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TransitionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
