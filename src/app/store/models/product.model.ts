import { Category } from './category.model';
import { Size } from './size.model';
import { Color } from './color.model';

export interface Product {
  ProductID: number;
  ProductCode: string;
  Name: string;
  CategoryID: number;
  Price: number;
  Description?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  Category?: Category;
  ProductVariants?: ProductVariant[];
  ProductImages?: ProductImage[];
}

export interface ProductVariant {
  VariantID: number;
  ProductID: number;
  SizeID: number;
  ColorID: number;
  Stock: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  Size?: Size;
  Color?: Color;
}

export interface ProductImage {
  ImageID: number;
  ProductID: number;
  Content: string; // Base64 string or URL
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateProductRequest {
  ProductCode: string;
  Name: string;
  CategoryID: number;
  Price: number;
  Description?: string;
  Variants: CreateProductVariantRequest[];
  Images?: string[]; // Base64 strings or URLs
}

export interface CreateProductVariantRequest {
  SizeID: number;
  ColorID: number;
  Stock: number;
}

export interface UpdateProductRequest {
  ProductID: number;
  ProductCode: string;
  Name: string;
  CategoryID: number;
  Price: number;
  Description?: string;
  IsActive: boolean;
}
