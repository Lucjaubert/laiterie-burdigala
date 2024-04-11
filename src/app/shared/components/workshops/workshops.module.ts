import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopsComponent } from './workshops.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WorkshopsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class WorkshopsModule { }
