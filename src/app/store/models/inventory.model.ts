import { ProductVariant } from './product.model';

export interface Inventory {
  InventoryID: number;
  VariantID: number;
  Stock: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  ProductVariant?: ProductVariant;
}

export interface UpdateInventoryRequest {
  VariantID: number;
  Stock: number;
}

export interface InventoryReport {
  VariantID: number;
  ProductName: string;
  SizeName: string;
  ColorName: string;
  CurrentStock: number;
  LowStockThreshold: number;
  IsLowStock: boolean;
}
