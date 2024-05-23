import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { spinnerInterceptor } from './shared/interceptors/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideProtractorTestingSupport(), provideRouter(routes),
    provideHttpClient(
      withInterceptors([spinnerInterceptor])
    ), provideAnimations(), provideToastr(
      { timeOut: 3000, positionClass: 'toast-top-right', preventDuplicates: true }
    ),]
};
