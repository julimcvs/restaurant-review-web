import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {serverErrorInterceptor} from "./interceptors/server-error.interceptor";
import {MessageService} from "primeng/api";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    MessageService,
    provideHttpClient(withInterceptors([serverErrorInterceptor])),
    provideAnimations()
  ]
};
