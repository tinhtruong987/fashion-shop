import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DataViewModule } from 'primeng/dataview';
import { SidebarModule } from 'primeng/sidebar';

import {
  Product,
  ProductFilter,
} from '../../../store/product/model/product.model';
import * as ProductActions from '../../../store/product/product.actions';
import {
  selectFilteredProducts,
  selectProductsLoading,
  selectProductError,
  selectAvailableCategories,
  selectAvailableBrands,
  selectCurrentFilter,
} from '../../../store/product/product.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    RatingModule,
    TagModule,
    DropdownModule,
    SliderModule,
    CheckboxModule,
    InputTextModule,
    ProgressSpinnerModule,
    DataViewModule,
    SidebarModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  categories$: Observable<string[]>;
  brands$: Observable<string[]>;
  currentFilter$: Observable<ProductFilter>;

  // Filter options
  sidebarVisible = false;
  sortOptions = [
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating: High to Low', value: 'rating-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Newest First', value: 'date-desc' },
  ];

  // Filter values
  selectedCategory = '';
  selectedBrand = '';
  priceRange = [0, 500];
  showOnlyInStock = false;
  searchTerm = '';
  selectedSort = '';

  layout: 'grid' | 'list' = 'grid';

  constructor(private store: Store) {
    this.products$ = this.store.select(selectFilteredProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductError);
    this.categories$ = this.store.select(selectAvailableCategories);
    this.brands$ = this.store.select(selectAvailableBrands);
    this.currentFilter$ = this.store.select(selectCurrentFilter);
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
  }

  applyFilters() {
    const filter: ProductFilter = {
      searchTerm: this.searchTerm || undefined,
      category: this.selectedCategory || undefined,
      brand: this.selectedBrand || undefined,
      priceMin: this.priceRange[0],
      priceMax: this.priceRange[1],
      inStock: this.showOnlyInStock || undefined,
    };

    this.store.dispatch(ProductActions.filterProducts({ filter }));
  }

  onSearch() {
    this.store.dispatch(
      ProductActions.searchProducts({ searchTerm: this.searchTerm })
    );
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.priceRange = [0, 500];
    this.showOnlyInStock = false;
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSortChange() {
    // Implement sorting logic here
    console.log('Sort changed:', this.selectedSort);
  }

  getDiscountedPrice(product: Product): number {
    if (product.originalPrice && product.discount) {
      return product.originalPrice * (1 - product.discount / 100);
    }
    return product.price;
  }
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder-product.jpg';
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
