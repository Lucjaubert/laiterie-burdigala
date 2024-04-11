import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brunchs',
  templateUrl: './brunchs.component.html',
  styleUrls: ['./brunchs.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class BrunchsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
