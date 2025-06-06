import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Product } from '../../../store/product/model/product.model';
import { AppState } from '../../../store/app.state';
import * as ProductActions from '../../../store/product/product.actions';
import {
  selectSelectedProduct,
  selectProductsLoading,
} from '../../../store/product/product.selectors';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    CardModule,
    GalleriaModule,
    RatingModule,
    TagModule,
    DividerModule,
    DropdownModule,
    InputNumberModule,
    TabViewModule,
    AccordionModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  product$: Observable<Product | null> = this.store.select(
    selectSelectedProduct
  );
  loading$: Observable<boolean> = this.store.select(selectProductsLoading);

  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.store.dispatch(ProductActions.loadProduct({ id: productId }));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDiscountPercentage(product: Product): number {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0;
    }
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }

  addToCart() {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', {
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
    });
  }

  buyNow() {
    // TODO: Implement buy now functionality
    console.log('Buy now:', {
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
