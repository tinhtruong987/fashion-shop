import { Category } from './category.model';
import { Size } from './size.model';
import { Color } from './color.model';

export interface Product {
  productID: number;
  productCode: string;
  name: string;
  categoryID: number;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  image: string;
}

export interface ProductVariant {
  variantID: number;
  productID: number;
  sizeID: number;
  colorID: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  size?: Size;
  color?: Color;
  product?: Product;
}

export interface ProductImage {
  imageID: number;
  productID: number;
  content: string; // Base64 string
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
