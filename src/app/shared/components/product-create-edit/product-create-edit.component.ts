import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Product } from '../../../store/product/model/product.model';
import { AppState } from '../../../store/app.state';
import * as ProductActions from '../../../store/product/product.actions';
import {
  selectSelectedProduct,
  selectProductsLoading,
} from '../../../store/product/product.selectors';

@Component({
  selector: 'app-product-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    ChipsModule,
    FileUploadModule,
    MessagesModule,
    MessageModule,
    DividerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './product-create-edit.component.html',
  styleUrl: './product-create-edit.component.scss',
})
export class ProductCreateEditComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroy$ = new Subject<void>();

  productForm!: FormGroup;
  product$: Observable<Product | null> = this.store.select(
    selectSelectedProduct
  );
  loading$: Observable<boolean> = this.store.select(selectProductsLoading);

  isEditMode = false;
  productId: string | null = null;

  categoryOptions = [
    { label: 'Dresses', value: 'Dresses' },
    { label: 'Tops', value: 'Tops' },
    { label: 'Bottoms', value: 'Bottoms' },
    { label: 'Outerwear', value: 'Outerwear' },
    { label: 'Footwear', value: 'Footwear' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Bags', value: 'Bags' },
    { label: 'Jewelry', value: 'Jewelry' },
  ];

  sizeOptions = [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: 'XXL', value: 'XXL' },
  ];

  colorOptions = [
    { label: 'Black', value: 'Black' },
    { label: 'White', value: 'White' },
    { label: 'Gray', value: 'Gray' },
    { label: 'Navy', value: 'Navy' },
    { label: 'Brown', value: 'Brown' },
    { label: 'Beige', value: 'Beige' },
    { label: 'Red', value: 'Red' },
    { label: 'Pink', value: 'Pink' },
    { label: 'Blue', value: 'Blue' },
    { label: 'Green', value: 'Green' },
    { label: 'Yellow', value: 'Yellow' },
    { label: 'Purple', value: 'Purple' },
  ];

  ngOnInit() {
    this.initializeForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.productId = params['id'];
      this.isEditMode = !!this.productId;

      if (this.isEditMode && this.productId) {
        this.store.dispatch(ProductActions.loadProduct({ id: this.productId }));

        this.product$.pipe(takeUntil(this.destroy$)).subscribe((product) => {
          if (product) {
            this.populateForm(product);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      originalPrice: [0],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      sizes: [[]],
      colors: [[]],
      stock: [0, [Validators.required, Validators.min(0)]],
      images: this.fb.array([]),
      tags: [[]],
      material: [''],
      careInstructions: [''],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      reviewCount: [0, [Validators.min(0)]],
    });
  }

  get imagesArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  populateForm(product: Product) {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      brand: product.brand,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      tags: product.tags,
      material: product.material,
      careInstructions: product.careInstructions,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });

    // Populate images
    this.imagesArray.clear();
    product.images?.forEach((image) => {
      this.imagesArray.push(this.fb.control(image));
    });
  }

  addImageUrl() {
    this.imagesArray.push(this.fb.control(''));
  }

  removeImageUrl(index: number) {
    this.imagesArray.removeAt(index);
  }

  onFileSelect(event: any) {
    // Handle file upload - in a real app, you'd upload to a server
    // For now, we'll just add placeholder URLs
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagesArray.push(this.fb.control(e.target.result));
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const productData: Partial<Product> = {
        ...formValue,
        images: this.imagesArray.value.filter(
          (url: string) => url.trim() !== ''
        ),
        id: this.isEditMode ? this.productId! : undefined,
      };
      if (this.isEditMode) {
        this.store.dispatch(
          ProductActions.updateProduct({
            product: productData as Product,
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully',
        });
      } else {
        this.store.dispatch(
          ProductActions.addProduct({
            product: productData as Product,
          })
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product created successfully',
        });
      }

      // Navigate back to products list after a delay
      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
      if (field.errors['max']) return `${fieldName} is too high`;
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}
