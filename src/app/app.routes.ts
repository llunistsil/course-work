import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './login/auth/auth.guard';
import { AnalyticsComponent } from './analytics/analytics.component';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
    },
    {
        path: 'analytics',
        component: AnalyticsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'history',
        component: HistoryComponent,
        canActivate: [authGuard],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
