import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrunchComponent } from './brunch.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BrunchComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class BrunchModule { }
