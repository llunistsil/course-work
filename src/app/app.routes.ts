import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './login/auth/auth.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        component: MainComponent,
        canActivate: [authGuard],
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
