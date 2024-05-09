import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuppliersComponent } from './suppliers.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SuppliersComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class SuppliersModule { }
