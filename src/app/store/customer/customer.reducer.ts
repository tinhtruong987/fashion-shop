import { createReducer, on } from '@ngrx/store';
import { Customer, CustomerFilter } from './model/customer.model';
import * as CustomerActions from './customer.actions';

export interface CustomerState {
  customers: Customer[];
  filteredCustomers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  currentFilter: CustomerFilter;
}

export const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  currentFilter: {},
};

export const customerReducer = createReducer(
  initialState,

  // Load customers
  on(CustomerActions.loadCustomers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CustomerActions.loadCustomersSuccess, (state, { customers }) => ({
    ...state,
    customers,
    filteredCustomers: customers,
    loading: false,
    error: null,
  })),

  on(CustomerActions.loadCustomersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Search customers
  on(CustomerActions.searchCustomers, (state, { searchTerm }) => {
    const filtered = state.customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        (customer.email &&
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return {
      ...state,
      filteredCustomers: filtered,
      currentFilter: { ...state.currentFilter, searchTerm },
    };
  }),

  // Filter customers
  on(CustomerActions.filterCustomers, (state, { filter }) => {
    let filtered = state.customers;

    if (filter.searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name
            .toLowerCase()
            .includes(filter.searchTerm!.toLowerCase()) ||
          customer.phone.includes(filter.searchTerm!) ||
          (customer.email &&
            customer.email
              .toLowerCase()
              .includes(filter.searchTerm!.toLowerCase()))
      );
    }

    if (filter.membershipLevel) {
      filtered = filtered.filter(
        (customer) => customer.membershipLevel === filter.membershipLevel
      );
    }

    if (filter.minLoyaltyPoints !== undefined) {
      filtered = filtered.filter(
        (customer) => customer.loyaltyPoints >= filter.minLoyaltyPoints!
      );
    }

    return {
      ...state,
      filteredCustomers: filtered,
      currentFilter: filter,
    };
  }),

  // Add customer
  on(CustomerActions.addCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [...state.customers, customer],
    filteredCustomers: [...state.filteredCustomers, customer],
    loading: false,
  })),

  // Update customer
  on(CustomerActions.updateCustomerSuccess, (state, { customer }) => {
    const updatedCustomers = state.customers.map((c) =>
      c.id === customer.id ? customer : c
    );
    const updatedFilteredCustomers = state.filteredCustomers.map((c) =>
      c.id === customer.id ? customer : c
    );

    return {
      ...state,
      customers: updatedCustomers,
      filteredCustomers: updatedFilteredCustomers,
      selectedCustomer:
        state.selectedCustomer?.id === customer.id
          ? customer
          : state.selectedCustomer,
      loading: false,
    };
  }),

  // Select customer for POS
  on(CustomerActions.selectCustomerForPOS, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
  }))
);
