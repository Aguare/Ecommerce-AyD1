import { HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

export const principalInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token');
  const router = inject(Router);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer=${token}`,
      },
    });

    return next(req);
  } else {
    if (router.url !== '/home' && router.url !== '/login') {
      router.navigate(['/home']);
      return next(req);
    } else {
      return next(req);
    }
  }
};
