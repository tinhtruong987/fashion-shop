import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { CustomerService } from './customer.service';
import * as CustomerActions from './customer.actions';

@Injectable()
export class CustomerEffects {
  private actions$ = inject(Actions);
  private customerService = inject(CustomerService);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.loadCustomers),
      switchMap(() =>
        this.customerService.getCustomers().pipe(
          map((customers) =>
            CustomerActions.loadCustomersSuccess({ customers })
          ),
          catchError((error) =>
            of(CustomerActions.loadCustomersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.addCustomer),
      switchMap(({ customer }) =>
        this.customerService.addCustomer(customer).pipe(
          map((savedCustomer) =>
            CustomerActions.addCustomerSuccess({ customer: savedCustomer })
          ),
          catchError((error) =>
            of(CustomerActions.addCustomerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateCustomer),
      switchMap(({ customer }) =>
        this.customerService.updateCustomer(customer).pipe(
          map((updatedCustomer) =>
            CustomerActions.updateCustomerSuccess({ customer: updatedCustomer })
          ),
          catchError((error) =>
            of(CustomerActions.updateCustomerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateLoyaltyPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerActions.updateLoyaltyPoints),
      switchMap(({ customerId, points }) =>
        this.customerService.updateLoyaltyPoints(customerId, points).pipe(
          map((customer) =>
            CustomerActions.updateCustomerSuccess({ customer })
          ),
          catchError((error) =>
            of(CustomerActions.updateCustomerFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
