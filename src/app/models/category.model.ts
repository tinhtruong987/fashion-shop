import { Product } from './product.model';

export interface Category {
  categoryID: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: Product[];
}
