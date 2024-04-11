import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
