import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { User } from './models/user';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (environment.setCookie) {
        document.cookie = 'accessToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5NTI2NTg1MTciLCJleHAiOjE3Mzk3NzUwNDYsImZpcnN0TmFtZSI6IkRtaXRyaXkiLCJ1c2VybmFtZSI6InN1Y2Nlc3NmdWxseV9mYWlsIn0._QZdTbIooo9r_00hsLfW74iDHOGBmHW24Rhz63qlrOyDjz-QIZ3J3Rm78nndZ7h9ZhlapzrSCALJcezrQbP3zA';
        authService.currentUser = { id: 1, username: 'admin' } as User;
        console.log(document.cookie);

        return true;
    } else if (authService.currentUser) {
        return true;
    } else {
        router.navigate(['login']);
        return false;
    }
};
