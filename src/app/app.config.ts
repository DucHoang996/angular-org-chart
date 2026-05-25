import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura, // Gán theme hệ thống mới tại đây
        options: {
          darkModeSelector: false // Tắt chế độ Dark Mode nếu bạn muốn dùng giao diện sáng mặc định
        }
      }
    })
  ]
};
