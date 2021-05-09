import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NominationsComponent } from './nominations.component';


@NgModule({
  declarations: [
    NominationsComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    NominationsComponent
  ]
})
export class NominationsModule { }
