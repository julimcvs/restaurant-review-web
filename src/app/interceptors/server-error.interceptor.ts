import {HttpInterceptorFn} from '@angular/common/http';
import {Inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {catchError, throwError} from "rxjs";

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = Inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status >= 400 && error.status < 500) {
        messageService.add({
          severity: 'error',
          summary: 'Client Error',
          detail: error.error?.message || 'An unexpected client error occurred.',
        });
      } else if (error.status >= 500) {
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: error.error?.message || 'An unexpected server error occurred.',
        });
      } else {
        messageService.add({
          severity: 'info',
          summary: 'Unknown Error',
          detail: 'Something went wrong. Please try again later.',
        });
      }

      return throwError(() => error);
    })
  );
};
