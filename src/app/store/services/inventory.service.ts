import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Inventory,
  InventoryReport,
  UpdateInventoryRequest,
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private mockInventory: Inventory[] = [
    {
      InventoryID: 1,
      VariantID: 1,
      Stock: 25,
      IsActive: true,
      CreatedAt: new Date('2024-06-01'),
      UpdatedAt: new Date('2024-06-01'),
    },
    {
      InventoryID: 2,
      VariantID: 2,
      Stock: 3,
      IsActive: true,
      CreatedAt: new Date('2024-06-02'),
      UpdatedAt: new Date('2024-06-02'),
    },
    {
      InventoryID: 3,
      VariantID: 3,
      Stock: 0,
      IsActive: true,
      CreatedAt: new Date('2024-05-28'),
      UpdatedAt: new Date('2024-05-28'),
    },
    {
      InventoryID: 4,
      VariantID: 4,
      Stock: 15,
      IsActive: true,
      CreatedAt: new Date('2024-06-03'),
      UpdatedAt: new Date('2024-06-03'),
    },
    {
      InventoryID: 5,
      VariantID: 5,
      Stock: 8,
      IsActive: true,
      CreatedAt: new Date('2024-06-01'),
      UpdatedAt: new Date('2024-06-01'),
    },
    {
      InventoryID: 6,
      VariantID: 6,
      Stock: 2,
      IsActive: true,
      CreatedAt: new Date('2024-06-04'),
      UpdatedAt: new Date('2024-06-04'),
    },
  ];

  getInventory(): Observable<Inventory[]> {
    return of(this.mockInventory).pipe(delay(300));
  }

  getInventoryById(id: number): Observable<Inventory | undefined> {
    const inventory = this.mockInventory.find((i) => i.InventoryID === id);
    return of(inventory).pipe(delay(200));
  }

  updateInventory(request: UpdateInventoryRequest): Observable<Inventory> {
    const index = this.mockInventory.findIndex(
      (i) => i.VariantID === request.VariantID
    );
    if (index !== -1) {
      this.mockInventory[index] = {
        ...this.mockInventory[index],
        Stock: request.Stock,
        UpdatedAt: new Date(),
      };
    }
    return of(this.mockInventory[index]).pipe(delay(400));
  }

  generateInventoryReport(): Observable<InventoryReport[]> {
    // For this mock implementation, return basic inventory reports
    const reports: InventoryReport[] = [
      {
        VariantID: 1,
        ProductName: 'Áo Polo Nam Basic',
        SizeName: 'M',
        ColorName: 'Đen',
        CurrentStock: 25,
        LowStockThreshold: 5,
        IsLowStock: false,
      },
      {
        VariantID: 2,
        ProductName: 'Áo Polo Nam Basic',
        SizeName: 'L',
        ColorName: 'Đen',
        CurrentStock: 3,
        LowStockThreshold: 5,
        IsLowStock: true,
      },
      {
        VariantID: 3,
        ProductName: 'Quần Jeans Slim',
        SizeName: '32',
        ColorName: 'Xanh dương',
        CurrentStock: 0,
        LowStockThreshold: 5,
        IsLowStock: true,
      },
    ];

    return of(reports).pipe(delay(1000));
  }

  getInventoryStats(): Observable<{
    totalProducts: number;
    totalStock: number;
    outOfStock: number;
    lowStock: number;
  }> {
    const stats = {
      totalProducts: this.mockInventory.length,
      totalStock: this.mockInventory.reduce((sum, item) => sum + item.Stock, 0),
      outOfStock: this.mockInventory.filter((item) => item.Stock === 0).length,
      lowStock: this.mockInventory.filter(
        (item) => item.Stock > 0 && item.Stock <= 5
      ).length,
    };

    return of(stats).pipe(delay(500));
  }
}
