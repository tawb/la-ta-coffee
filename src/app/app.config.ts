import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { appInfoInterceptor } from './interceptors/app-info.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })),
    provideHttpClient(
      withFetch(),
      withInterceptors([appInfoInterceptor, authInterceptor, errorHandlingInterceptor])
    )
  ]
};
//eventCoalescing: true = if several events fire back-to-back in the same tick, 
// Angular runs one change-detection check for all of them combined, 
// instead of a separate check for each — fewer redundant re-renders.