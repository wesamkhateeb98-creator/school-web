import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptor/token-interceptor';
import { CustomPaginatorIntl } from './shared/services/custom-paginator-intl';
import { MatPaginatorIntl } from '@angular/material/paginator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),    
    provideHttpClient(withInterceptors([tokenInterceptor])),
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
};
