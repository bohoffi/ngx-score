import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScoreDetailsComponent} from './components/score-details/score-details.component';

// add your angular components here (directives, components, filters, pipes ...)
export const MY_NG_COMPONENTS = [
  ScoreDetailsComponent
];

// add your services here
const MY_SERVICES = [];

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [MY_NG_COMPONENTS],
  declarations: [MY_NG_COMPONENTS]
})
export class NgxScoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxScoreModule,
      providers: [MY_SERVICES]
    };
  }
}
