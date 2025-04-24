import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor }     from './core/interceptors/jwt.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    AuthModule,
    ProductsModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
})
export class AppModule {}
