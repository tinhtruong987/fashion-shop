import { createReducer, on } from '@ngrx/store';
import { Product, ProductFilter } from './model/product.model';
import * as ProductActions from './product.actions';

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  currentFilter: ProductFilter;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  currentFilter: {},
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,

  // Load Products
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    filteredProducts: products,
    loading: false,
    error: null,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Product
  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null,
  })),
  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Filter Products
  on(ProductActions.filterProducts, (state, { filter }) => {
    let filteredProducts = [...state.products];

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filter.category
      );
    }

    if (filter.brand) {
      filteredProducts = filteredProducts.filter(
        (p) => p.brand === filter.brand
      );
    }

    if (filter.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filter.priceMin!
      );
    }

    if (filter.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filter.priceMax!
      );
    }

    if (filter.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.inStock === filter.inStock
      );
    }

    return {
      ...state,
      filteredProducts,
      currentFilter: filter,
    };
  }),

  // Search Products
  on(ProductActions.searchProducts, (state, { searchTerm }) => {
    const filteredProducts = state.products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return {
      ...state,
      filteredProducts,
      currentFilter: { ...state.currentFilter, searchTerm },
    };
  }),

  // Add Product
  on(ProductActions.addProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: [...state.products, product],
    filteredProducts: [...state.filteredProducts, product],
    loading: false,
    error: null,
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    filteredProducts: state.filteredProducts.map((p) =>
      p.id === product.id ? product : p
    ),
    selectedProduct:
      state.selectedProduct?.id === product.id
        ? product
        : state.selectedProduct,
    loading: false,
    error: null,
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== productId),
    filteredProducts: state.filteredProducts.filter((p) => p.id !== productId),
    selectedProduct:
      state.selectedProduct?.id === productId ? null : state.selectedProduct,
    loading: false,
    error: null,
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
