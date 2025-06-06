import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CustomerState } from './customer.reducer';

export const selectCustomerState =
  createFeatureSelector<CustomerState>('customers');

export const selectAllCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.customers
);

export const selectFilteredCustomers = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.filteredCustomers
);

export const selectSelectedCustomer = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.selectedCustomer
);

export const selectCustomerLoading = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.loading
);

export const selectCustomerError = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.error
);

export const selectCurrentFilter = createSelector(
  selectCustomerState,
  (state: CustomerState) => state.currentFilter
);

export const selectCustomerById = (customerId: string) =>
  createSelector(selectAllCustomers, (customers) =>
    customers.find((customer) => customer.id === customerId)
  );

export const selectCustomersByMembershipLevel = (level: string) =>
  createSelector(selectAllCustomers, (customers) =>
    customers.filter((customer) => customer.membershipLevel === level)
  );

export const selectHighValueCustomers = createSelector(
  selectAllCustomers,
  (customers) =>
    customers.filter((customer) => customer.totalPurchases >= 10000000)
);
