import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { productReducer } from './store/product/product.reducer';
import { customerReducer } from './store/customer/customer.reducer';
import { posReducer } from './store/pos/pos.reducer';
import { ProductEffects } from './store/product/product.effects';
import { CustomerEffects } from './store/customer/customer.effects';
import { POSEffects } from './store/pos/pos.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore({
      products: productReducer,
      customers: customerReducer,
      pos: posReducer,
    }),
    provideEffects([ProductEffects, CustomerEffects, POSEffects]),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
