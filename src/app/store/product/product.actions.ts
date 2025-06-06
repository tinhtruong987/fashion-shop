import { createAction, props } from '@ngrx/store';
import { Product, ProductFilter } from './model/product.model';

// Load Products
export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

// Load Single Product
export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ id: string }>()
);
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: string }>()
);

// Filter Products
export const filterProducts = createAction(
  '[Product] Filter Products',
  props<{ filter: ProductFilter }>()
);

// Search Products
export const searchProducts = createAction(
  '[Product] Search Products',
  props<{ searchTerm: string }>()
);

export const addProduct = createAction(
  '[Product] Add Product',
  props<{ product: Product }>()
);
export const addProductSuccess = createAction(
  '[Product] Add Product Success',
  props<{ product: Product }>()
);
export const addProductFailure = createAction(
  '[Product] Add Product Failure',
  props<{ error: string }>()
);

export const updateProduct = createAction(
  '[Product] Update Product',
  props<{ product: Product }>()
);
export const updateProductSuccess = createAction(
  '[Product] Update Product Success',
  props<{ product: Product }>()
);
export const updateProductFailure = createAction(
  '[Product] Update Product Failure',
  props<{ error: string }>()
);

export const deleteProduct = createAction(
  '[Product] Delete Product',
  props<{ productId: string }>()
);
export const deleteProductSuccess = createAction(
  '[Product] Delete Product Success',
  props<{ productId: string }>()
);
export const deleteProductFailure = createAction(
  '[Product] Delete Product Failure',
  props<{ error: string }>()
);

// Barrel export for all actions
export const ProductActions = {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  loadProduct,
  loadProductSuccess,
  loadProductFailure,
  searchProducts,
  searchProductsSuccess: loadProductsSuccess, // Alias
  searchProductsFailure: loadProductsFailure, // Alias
  filterProducts,
  clearFilters: filterProducts, // Alias for now
  createProduct: addProduct, // Alias for compatibility
  createProductSuccess: addProductSuccess,
  createProductFailure: addProductFailure,
  addProduct,
  addProductSuccess,
  addProductFailure,
  updateProduct,
  updateProductSuccess,
  updateProductFailure,
  deleteProduct,
  deleteProductSuccess,
  deleteProductFailure,
};
