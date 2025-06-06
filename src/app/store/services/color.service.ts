import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Color,
  CreateColorRequest,
  UpdateColorRequest,
} from '../models/color.model';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private mockColors: Color[] = [
    {
      ColorID: 1,
      ColorName: 'Đỏ',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 2,
      ColorName: 'Xanh dương',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 3,
      ColorName: 'Đen',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 4,
      ColorName: 'Trắng',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 5,
      ColorName: 'Xám',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 6,
      ColorName: 'Vàng',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 7,
      ColorName: 'Xanh lá',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
    {
      ColorID: 8,
      ColorName: 'Hồng',
      IsActive: true,
      CreatedAt: new Date('2024-01-01'),
      UpdatedAt: new Date('2024-01-01'),
    },
  ];

  getColors(): Observable<Color[]> {
    return of(this.mockColors.filter((c) => c.IsActive)).pipe(delay(300));
  }

  getColorById(id: number): Observable<Color | undefined> {
    const color = this.mockColors.find((c) => c.ColorID === id);
    return of(color).pipe(delay(200));
  }

  createColor(request: CreateColorRequest): Observable<Color> {
    const newId = Math.max(...this.mockColors.map((c) => c.ColorID)) + 1;
    const newColor: Color = {
      ColorID: newId,
      ColorName: request.ColorName,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    this.mockColors.push(newColor);
    return of(newColor).pipe(delay(400));
  }

  updateColor(request: UpdateColorRequest): Observable<Color> {
    const index = this.mockColors.findIndex(
      (c) => c.ColorID === request.ColorID
    );
    if (index !== -1) {
      this.mockColors[index] = {
        ...this.mockColors[index],
        ColorName: request.ColorName,
        IsActive: request.IsActive,
        UpdatedAt: new Date(),
      };
    }
    return of(this.mockColors[index]).pipe(delay(400));
  }

  deleteColor(id: number): Observable<boolean> {
    const index = this.mockColors.findIndex((c) => c.ColorID === id);
    if (index !== -1) {
      this.mockColors[index].IsActive = false;
      this.mockColors[index].UpdatedAt = new Date();
    }
    return of(true).pipe(delay(400));
  }
}
