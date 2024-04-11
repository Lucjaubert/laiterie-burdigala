import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workshops',
  templateUrl: './workshops.component.html',
  styleUrls: ['./workshops.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WorkshopsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
