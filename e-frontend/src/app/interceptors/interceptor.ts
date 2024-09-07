import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageService } from "../services/local-storage.service";
import { catchError, Observable, of } from "rxjs";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable()
export class Inteceptor implements HttpInterceptor {
  constructor(
    private _cookieService: CookieService,
    private _localStorage: LocalStorageService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Authorization : `Bearer_auth=${this._cookieService.get('token')}`
      },
    });

    return next.handle(req).pipe(
      catchError((errorResponse: any) => {
				if (errorResponse instanceof HttpErrorResponse) {
					if (errorResponse.status === 401 && errorResponse.error) {
						const { status, message } = errorResponse.error;
						if (status === 5) {
							this._localStorage.clear();
              this._cookieService.deleteAll();
              Swal.fire({
                title: "Error",
                text: message,
                icon: "error",
                confirmButtonText: "Ok",
              });
							this.router.navigate(["/home"]);
						}
					}
				}
				return of(errorResponse);
			})
    );
  }
}
