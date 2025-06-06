import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from './product.reducer';

export const selectProductState =
  createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);

export const selectFilteredProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.filteredProducts
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProduct
);

export const selectCurrentFilter = createSelector(
  selectProductState,
  (state: ProductState) => state.currentFilter
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectProductError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);

export const selectProductById = (id: string) =>
  createSelector(selectAllProducts, (products) =>
    products.find((product) => product.id === id)
  );

export const selectProductsByCategory = (category: string) =>
  createSelector(selectAllProducts, (products) =>
    products.filter((product) => product.category === category)
  );

export const selectAvailableCategories = createSelector(
  selectAllProducts,
  (products) => [...new Set(products.map((product) => product.category))]
);

export const selectAvailableBrands = createSelector(
  selectAllProducts,
  (products) => [...new Set(products.map((product) => product.brand))]
);
