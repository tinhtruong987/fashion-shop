import { createReducer, on } from '@ngrx/store';
import { CartItem, Sale } from './model/pos.model';
import { Customer } from '../customer/model/customer.model';
import * as POSActions from './pos.actions';

export interface POSState {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  currentSale: Sale | null;
  loyaltyPointsToUse: number;
  discountPercentage: number;
  subtotal: number;
  total: number;
  loading: boolean;
  error: string | null;
}

export const initialState: POSState = {
  cart: [],
  selectedCustomer: null,
  currentSale: null,
  loyaltyPointsToUse: 0,
  discountPercentage: 0,
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
};

export const posReducer = createReducer(
  initialState,

  // Cart actions
  on(POSActions.addToCart, (state, { item }) => {
    const existingItemIndex = state.cart.findIndex(
      (cartItem) => cartItem.productId === item.productId
    );
    let newCart: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      newCart = state.cart.map((cartItem, index) =>
        index === existingItemIndex
          ? {
              ...cartItem,
              quantity: cartItem.quantity + item.quantity,
              totalPrice: (cartItem.quantity + item.quantity) * cartItem.price,
            }
          : cartItem
      );
    } else {
      // Add new item
      newCart = [
        ...state.cart,
        { ...item, totalPrice: item.price * item.quantity },
      ];
    }

    const subtotal = newCart.reduce(
      (sum, cartItem) => sum + cartItem.totalPrice,
      0
    );
    const discountAmount = (subtotal * state.discountPercentage) / 100;
    const total = subtotal - discountAmount;

    return {
      ...state,
      cart: newCart,
      subtotal,
      total,
    };
  }),

  on(POSActions.removeFromCart, (state, { productId }) => {
    const newCart = state.cart.filter((item) => item.productId !== productId);
    const subtotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = (subtotal * state.discountPercentage) / 100;
    const total = subtotal - discountAmount;

    return {
      ...state,
      cart: newCart,
      subtotal,
      total,
    };
  }),

  on(POSActions.updateCartItemQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const newCart = state.cart.filter((item) => item.productId !== productId);
      const subtotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
      const discountAmount = (subtotal * state.discountPercentage) / 100;
      const total = subtotal - discountAmount;

      return {
        ...state,
        cart: newCart,
        subtotal,
        total,
      };
    }

    const newCart = state.cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity, totalPrice: item.price * quantity }
        : item
    );

    const subtotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = (subtotal * state.discountPercentage) / 100;
    const total = subtotal - discountAmount;

    return {
      ...state,
      cart: newCart,
      subtotal,
      total,
    };
  }),

  on(
    POSActions.updateQuantity,
    (state, { productId, quantity, isIncrease }) => {
      const existingItem = state.cart.find(
        (item) => item.productId === productId
      );
      if (!existingItem) return state;

      const newQuantity = isIncrease
        ? existingItem.quantity + quantity
        : Math.max(1, existingItem.quantity - quantity);

      const newCart = state.cart.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.price * newQuantity,
            }
          : item
      );

      const subtotal = newCart.reduce((sum, item) => sum + item.totalPrice, 0);
      const discountAmount = (subtotal * state.discountPercentage) / 100;
      const total = subtotal - discountAmount;

      return {
        ...state,
        cart: newCart,
        subtotal,
        total,
      };
    }
  ),

  on(POSActions.clearCart, (state) => ({
    ...state,
    cart: [],
    subtotal: 0,
    total: 0,
    loyaltyPointsToUse: 0,
    discountPercentage: 0,
  })),

  // Customer selection
  on(POSActions.selectCustomer, (state, { customer }) => ({
    ...state,
    selectedCustomer: customer,
    loyaltyPointsToUse: 0,
    discountPercentage: 0,
  })),

  // Loyalty points
  on(POSActions.setLoyaltyPointsToUse, (state, { points }) => {
    let discountPercentage = 0;

    if (state.selectedCustomer && points > 0) {
      const discountRates = {
        Bronze: 0.01, // 1% per 100 points
        Silver: 0.015, // 1.5% per 100 points
        Gold: 0.02, // 2% per 100 points
        Platinum: 0.025, // 2.5% per 100 points
      };

      const rate =
        discountRates[
          state.selectedCustomer.membershipLevel as keyof typeof discountRates
        ] || 0.01;
      discountPercentage = Math.min((points / 100) * rate * 100, 50); // Max 50% discount
    }

    const discountAmount = (state.subtotal * discountPercentage) / 100;
    const total = state.subtotal - discountAmount;

    return {
      ...state,
      loyaltyPointsToUse: points,
      discountPercentage,
      total,
    };
  }),

  // Payment
  on(POSActions.processPayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(POSActions.processPaymentSuccess, (state, { sale }) => ({
    ...state,
    currentSale: sale,
    loading: false,
    error: null,
  })),

  on(POSActions.processPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Reset POS state
  on(POSActions.resetPOSState, () => initialState)
);
