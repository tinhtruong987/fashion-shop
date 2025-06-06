import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Size,
  CreateSizeRequest,
  UpdateSizeRequest,
} from '../models/size.model';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  private mockSizes: Size[] = [
    {
      SizeID: 1,
      SizeName: 'XS',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      SizeID: 2,
      SizeName: 'S',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      SizeID: 3,
      SizeName: 'M',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      SizeID: 4,
      SizeName: 'L',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      SizeID: 5,
      SizeName: 'XL',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      SizeID: 6,
      SizeName: 'XXL',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
  ];

  getSizes(): Observable<Size[]> {
    return of(this.mockSizes.filter((s) => s.IsActive)).pipe(delay(300));
  }

  getSizeById(id: number): Observable<Size | undefined> {
    const size = this.mockSizes.find((s) => s.SizeID === id);
    return of(size).pipe(delay(200));
  }

  createSize(request: CreateSizeRequest): Observable<Size> {
    const newId = Math.max(...this.mockSizes.map((s) => s.SizeID)) + 1;
    const newSize: Size = {
      SizeID: newId,
      SizeName: request.SizeName,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    this.mockSizes.push(newSize);
    return of(newSize).pipe(delay(400));
  }

  updateSize(request: UpdateSizeRequest): Observable<Size> {
    const index = this.mockSizes.findIndex((s) => s.SizeID === request.SizeID);
    if (index !== -1) {
      this.mockSizes[index] = {
        ...this.mockSizes[index],
        SizeName: request.SizeName,
        IsActive: request.IsActive,
        UpdatedAt: new Date(),
      };
    }
    return of(this.mockSizes[index]).pipe(delay(400));
  }

  deleteSize(id: number): Observable<boolean> {
    const index = this.mockSizes.findIndex((s) => s.SizeID === id);
    if (index !== -1) {
      this.mockSizes[index].IsActive = false;
      this.mockSizes[index].UpdatedAt = new Date();
    }
    return of(true).pipe(delay(400));
  }
}
