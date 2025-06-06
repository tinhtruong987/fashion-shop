export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stock: number; // Also support 'stock' alongside 'stockQuantity'
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  material?: string;
  careInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  size?: string;
  color?: string;
  inStock?: boolean;
  searchTerm?: string;
}
