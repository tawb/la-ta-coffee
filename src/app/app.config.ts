import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),//watch everything, recheck broadly
    provideRouter(routes, withInMemoryScrolling({//a function that returns a configuration object describing how the router should handle scroll position during navigation
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'//go back where you left not the top  
    })),
    provideHttpClient(withFetch())
  ]
};
//eventCoalescing: true = if several events fire back-to-back in the same tick, 
// Angular runs one change-detection check for all of them combined, 
// instead of a separate check for each — fewer redundant re-renders.