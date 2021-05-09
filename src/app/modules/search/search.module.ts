import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [
    SearchComponent,
    SearchBarComponent,
    SearchResultsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    SearchComponent,
    SearchBarComponent,
    SearchResultsComponent
  ]
})
export class SearchModule { }
