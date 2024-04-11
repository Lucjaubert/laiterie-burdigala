import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrunchsComponent } from './brunchs.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: BrunchsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class BrunchsModule { }
