import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { authInterceptor } from './interceptores/auth.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [

    importProvidersFrom(AppRoutingModule),

    provideHttpClient(
      withInterceptors([authInterceptor])
    )

  ]

};