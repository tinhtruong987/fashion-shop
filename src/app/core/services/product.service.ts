import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductVariant } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Size } from '../../models/variant.model';
import { Color } from '../../models/variant.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      productID: 1,
      productCode: 'TS001',
      name: 'Áo thun basic',
      categoryID: 1,
      price: 250000,
      description: 'Áo thun cotton 100%',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: [
        {
          variantID: 1,
          productID: 1,
          sizeID: 1,
          colorID: 1,
          stock: 100,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          size: {
            sizeID: 1,
            sizeName: 'S',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          color: {
            colorID: 1,
            colorName: 'Đen',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    },
  ];

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.mockProducts.find((p) => p.productID === id));
  }

  createProduct(
    product: Omit<Product, 'productID' | 'createdAt' | 'updatedAt'>
  ): Observable<Product> {
    const newProduct: Product = {
      ...product,
      productID: this.mockProducts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct);
  }

  updateProduct(
    id: number,
    product: Partial<Product>
  ): Observable<Product | undefined> {
    const index = this.mockProducts.findIndex((p) => p.productID === id);
    if (index !== -1) {
      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...product,
        updatedAt: new Date(),
      };
      return of(this.mockProducts[index]);
    }
    return of(undefined);
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.mockProducts.findIndex((p) => p.productID === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getProductVariants(productId: number): Observable<ProductVariant[]> {
    const product = this.mockProducts.find((p) => p.productID === productId);
    return of(product?.variants || []);
  }

  updateStock(variantId: number, quantity: number): Observable<boolean> {
    for (const product of this.mockProducts) {
      const variant = product.variants?.find((v) => v.variantID === variantId);
      if (variant) {
        variant.stock = quantity;
        variant.updatedAt = new Date();
        return of(true);
      }
    }
    return of(false);
  }
}
