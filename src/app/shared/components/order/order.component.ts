import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class OrderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
