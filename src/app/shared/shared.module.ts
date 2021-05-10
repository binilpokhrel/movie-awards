import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitleYearPipe } from './pipes/movie-label.pipe';
import { PageItemRangePipe } from './pipes/page-item-range.pipe';

@NgModule({
  declarations: [
    PageItemRangePipe,
    TitleYearPipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  exports: [
    PageItemRangePipe,
    TitleYearPipe,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
