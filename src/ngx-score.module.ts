import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// add your angular components here (directives, components, filters, pipes ...)
export const MY_NG_COMPONENTS = [];

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

export {createTokenizer, createRenderer, ITokenizer, TokenizerType, IRenderer} from './processing';
export {Common, MusicXml} from './common/model';
