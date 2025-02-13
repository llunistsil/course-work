import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: MainComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
