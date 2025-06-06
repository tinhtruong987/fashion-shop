import { createAction, props } from '@ngrx/store';
import { CartItem, Sale, PaymentMethod } from './model/pos.model';
import { Customer } from '../customer/model/customer.model';

// Cart actions
export const addToCart = createAction(
  '[POS] Add to Cart',
  props<{ item: CartItem }>()
);

export const removeFromCart = createAction(
  '[POS] Remove from Cart',
  props<{ productId: string }>()
);

export const updateCartItemQuantity = createAction(
  '[POS] Update Cart Item Quantity',
  props<{ productId: string; quantity: number }>()
);

export const updateQuantity = createAction(
  '[POS] Update Quantity',
  props<{ productId: string; quantity: number; isIncrease: boolean }>()
);

export const clearCart = createAction('[POS] Clear Cart');

// Customer selection
export const selectCustomer = createAction(
  '[POS] Select Customer',
  props<{ customer: Customer | null }>()
);

// Loyalty points
export const setLoyaltyPointsToUse = createAction(
  '[POS] Set Loyalty Points to Use',
  props<{ points: number }>()
);

export const calculateDiscount = createAction('[POS] Calculate Discount');

// Payment
export const processPayment = createAction(
  '[POS] Process Payment',
  props<{
    customerId?: string;
    loyaltyPointsUsed?: number;
    paymentMethods: PaymentMethod[];
    cashierInfo: { id: string; name: string };
  }>()
);

export const processPaymentSuccess = createAction(
  '[POS] Process Payment Success',
  props<{ sale: Sale }>()
);

export const processPaymentFailure = createAction(
  '[POS] Process Payment Failure',
  props<{ error: string }>()
);

// Reset POS state
export const resetPOSState = createAction('[POS] Reset State');
