import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitleYearPipe } from './pipes/movie-label.pipe';

@NgModule({
  declarations: [
    TitleYearPipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  exports: [
    TitleYearPipe,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
