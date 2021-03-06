import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {routing,appRoutingProviders} from './app.routing';
import {FormsModule} from '@angular/forms'
//import {HttpModule} from '@angular/http'
import {HttpClient, HttpClientModule} from '@angular/common/http'


import { AppComponent } from './app.component';
//Componentes
import {LoginComponent} from './components/login/login.component'
import {RegisterComponent} from './components/register/register.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
