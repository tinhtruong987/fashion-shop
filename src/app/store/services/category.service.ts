import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private mockCategories: Category[] = [
    {
      CategoryID: 1,
      CategoryName: 'Áo sơ mi',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      CategoryID: 2,
      CategoryName: 'Quần jean',
      IsActive: true,
      CreatedAt: new Date('2024-01-02'),
      UpdatedAt: new Date('2024-01-02'),
    },
    {
      CategoryID: 3,
      CategoryName: 'Váy',
      IsActive: true,
      CreatedAt: new Date('2024-01-03'),
      UpdatedAt: new Date('2024-01-03'),
    },
    {
      CategoryID: 4,
      CategoryName: 'Áo khoác',
      IsActive: true,
      CreatedAt: new Date('2024-01-04'),
      UpdatedAt: new Date('2024-01-04'),
    },
    {
      CategoryID: 5,
      CategoryName: 'Phụ kiện',
      IsActive: true,
      CreatedAt: new Date('2024-01-05'),
      UpdatedAt: new Date('2024-01-05'),
    },
  ];

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories.filter((c) => c.IsActive)).pipe(delay(500));
  }

  getCategoryById(id: number): Observable<Category | undefined> {
    const category = this.mockCategories.find((c) => c.CategoryID === id);
    return of(category).pipe(delay(300));
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    const newId = Math.max(...this.mockCategories.map((c) => c.CategoryID)) + 1;
    const newCategory: Category = {
      CategoryID: newId,
      CategoryName: request.CategoryName,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    this.mockCategories.push(newCategory);
    return of(newCategory).pipe(delay(500));
  }

  updateCategory(request: UpdateCategoryRequest): Observable<Category> {
    const index = this.mockCategories.findIndex(
      (c) => c.CategoryID === request.CategoryID
    );
    if (index !== -1) {
      this.mockCategories[index] = {
        ...this.mockCategories[index],
        CategoryName: request.CategoryName,
        IsActive: request.IsActive,
        UpdatedAt: new Date(),
      };
    }
    return of(this.mockCategories[index]).pipe(delay(500));
  }

  deleteCategory(id: number): Observable<boolean> {
    const index = this.mockCategories.findIndex((c) => c.CategoryID === id);
    if (index !== -1) {
      this.mockCategories[index].IsActive = false;
      this.mockCategories[index].UpdatedAt = new Date();
    }
    return of(true).pipe(delay(500));
  }
}
