import { createSelector, createFeatureSelector } from '@ngrx/store';
import { POSState } from './pos.reducer';

export const selectPOSState = createFeatureSelector<POSState>('pos');

export const selectCart = createSelector(
  selectPOSState,
  (state: POSState) => state.cart
);

export const selectCartItemCount = createSelector(selectCart, (cart) =>
  cart.reduce((total, item) => total + item.quantity, 0)
);

export const selectSelectedCustomer = createSelector(
  selectPOSState,
  (state: POSState) => state.selectedCustomer
);

export const selectCurrentSale = createSelector(
  selectPOSState,
  (state: POSState) => state.currentSale
);

export const selectLoyaltyPointsToUse = createSelector(
  selectPOSState,
  (state: POSState) => state.loyaltyPointsToUse
);

export const selectDiscountPercentage = createSelector(
  selectPOSState,
  (state: POSState) => state.discountPercentage
);

export const selectSubtotal = createSelector(
  selectPOSState,
  (state: POSState) => state.subtotal
);

export const selectTotal = createSelector(
  selectPOSState,
  (state: POSState) => state.total
);

export const selectPOSLoading = createSelector(
  selectPOSState,
  (state: POSState) => state.loading
);

export const selectPOSError = createSelector(
  selectPOSState,
  (state: POSState) => state.error
);

export const selectDiscountAmount = createSelector(
  selectSubtotal,
  selectDiscountPercentage,
  (subtotal, discountPercentage) => (subtotal * discountPercentage) / 100
);

export const selectCanProcessPayment = createSelector(
  selectCart,
  selectTotal,
  (cart, total) => cart.length > 0 && total > 0
);

export const selectCartIsEmpty = createSelector(
  selectCart,
  (cart) => cart.length === 0
);

export const selectHasSelectedCustomer = createSelector(
  selectSelectedCustomer,
  (customer) => customer !== null
);
