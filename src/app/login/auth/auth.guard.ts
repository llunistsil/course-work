import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { User } from './models/user';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (environment.setCookie) {
        document.cookie = 'accessToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5NTI2NTg1MTciLCJleHAiOjE3Mzk1Mzk3NjIsImZpcnN0TmFtZSI6IkRtaXRyaXkiLCJ1c2VybmFtZSI6InN1Y2Nlc3NmdWxseV9mYWlsIn0.ImtmNuPWVedizEK0FAkchTs4g8v0snxZ7KpN52Lu5CagvLokAQX-dHqMvKnMXIpj1Cxg_J9uVNMSZ0EnmSZjGQ; Path=/; Secure; HttpOnly; SameSite=None';
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
