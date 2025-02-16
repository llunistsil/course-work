import { HttpInterceptorFn } from '@angular/common/http';

export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({
        withCredentials: true,
        url: `http://localhost:8081${req.url}`
    }));
};