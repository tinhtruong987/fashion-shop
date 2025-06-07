import { Category } from './category.model';
import { Color, Size } from './variant.model';

export interface Product {
  productID: number;
  productCode: string;
  name: string;
  categoryID: number;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductVariant {
  variantID: number;
  productID: number;
  sizeID: number;
  colorID: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  size?: Size;
  color?: Color;
}

export interface ProductImage {
  imageID: number;
  productID: number;
  content: string; // Base64 string
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
