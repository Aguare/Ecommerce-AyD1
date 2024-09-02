import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export const principalInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
