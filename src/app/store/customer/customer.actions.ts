import { createAction, props } from '@ngrx/store';
import { Customer, CustomerFilter } from './model/customer.model';

// Load customers
export const loadCustomers = createAction('[Customer] Load Customers');
export const loadCustomersSuccess = createAction(
  '[Customer] Load Customers Success',
  props<{ customers: Customer[] }>()
);
export const loadCustomersFailure = createAction(
  '[Customer] Load Customers Failure',
  props<{ error: string }>()
);

// Search customers
export const searchCustomers = createAction(
  '[Customer] Search Customers',
  props<{ searchTerm: string }>()
);

// Filter customers
export const filterCustomers = createAction(
  '[Customer] Filter Customers',
  props<{ filter: CustomerFilter }>()
);

// Add customer
export const addCustomer = createAction(
  '[Customer] Add Customer',
  props<{ customer: Customer }>()
);
export const addCustomerSuccess = createAction(
  '[Customer] Add Customer Success',
  props<{ customer: Customer }>()
);
export const addCustomerFailure = createAction(
  '[Customer] Add Customer Failure',
  props<{ error: string }>()
);

// Update customer
export const updateCustomer = createAction(
  '[Customer] Update Customer',
  props<{ customer: Customer }>()
);
export const updateCustomerSuccess = createAction(
  '[Customer] Update Customer Success',
  props<{ customer: Customer }>()
);
export const updateCustomerFailure = createAction(
  '[Customer] Update Customer Failure',
  props<{ error: string }>()
);

// Update loyalty points
export const updateLoyaltyPoints = createAction(
  '[Customer] Update Loyalty Points',
  props<{ customerId: string; points: number }>()
);

// Select customer for POS
export const selectCustomerForPOS = createAction(
  '[Customer] Select Customer for POS',
  props<{ customer: Customer | null }>()
);
