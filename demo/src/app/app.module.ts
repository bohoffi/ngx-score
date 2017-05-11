import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppRoutingModule} from './app-routing';
import {AppSharedModule} from './shared/shared.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {GettingStartedComponent} from './getting-started/getting-started.component';
import {NgxScoreModule} from 'ngx-score';


@NgModule({
  declarations: [
    AppComponent,
    GettingStartedComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    AppSharedModule,
    NgxScoreModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
