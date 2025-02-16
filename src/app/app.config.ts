import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withCredentialsInterceptor } from './with-credentials.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptors([withCredentialsInterceptor])),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        NG_EVENT_PLUGINS
    ]
};
