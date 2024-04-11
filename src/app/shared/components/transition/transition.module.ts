import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransitionComponent } from './transition.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: TransitionComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class TransitionModule { }
