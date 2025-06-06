import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductFilter } from './model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/products'; // URL backend

  // Mock data for demonstration
  private mockProducts: Product[] = [
    {
      id: '1',
      code: 'DRESS_001',
      name: 'Elegant Summer Dress',
      description:
        'A beautiful flowing summer dress perfect for any occasion. Made with high-quality fabric that is comfortable and breathable.',
      category: 'Dresses',
      brand: 'Fashion Co',
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        'https://images.unsplash.com/photo-1566479179817-c9d6b3e2e87e?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Red', 'Green'],
      inStock: true,
      stock: 25,
      stockQuantity: 25,
      rating: 4.5,
      reviewCount: 128,
      tags: ['summer', 'casual', 'elegant'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: '2',
      code: 'SHIRT_002',
      name: 'Classic White Shirt',
      description:
        'A timeless white shirt that never goes out of style. Perfect for office wear or casual occasions.',
      category: 'Shirts',
      brand: 'Style Plus',
      price: 49.99,
      originalPrice: 59.99,
      discount: 17,
      images: [
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Light Blue', 'Pink'],
      inStock: true,
      stock: 40,
      stockQuantity: 40,
      rating: 4.2,
      reviewCount: 89,
      tags: ['classic', 'office', 'versatile'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-04-05'),
    },
    {
      id: '3',
      code: 'JEANS_003',
      name: 'Slim Fit Jeans',
      description:
        'Modern slim fit jeans with a comfortable stretch. Perfect for everyday wear.',
      category: 'Jeans',
      brand: 'Denim Works',
      price: 79.99,
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
      ],
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Dark Blue', 'Light Blue', 'Black'],
      inStock: true,
      stock: 30,
      stockQuantity: 30,
      rating: 4.7,
      reviewCount: 156,
      tags: ['casual', 'denim', 'slim-fit'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: '4',
      code: 'JACKET_004',
      name: 'Leather Jacket',
      description:
        'Premium leather jacket for the fashion-forward individual. Genuine leather with premium finish.',
      category: 'Jackets',
      brand: 'Urban Style',
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      images: [
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Brown'],
      inStock: true,
      stock: 15,
      stockQuantity: 15,
      rating: 4.8,
      reviewCount: 67,
      tags: ['leather', 'premium', 'urban'],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-04-10'),
    },
    {
      id: '5',
      code: 'SKIRT_005',
      name: 'Pleated Mini Skirt',
      description:
        'Trendy pleated mini skirt that adds a playful touch to any outfit.',
      category: 'Skirts',
      brand: 'Youth Fashion',
      price: 34.99,
      images: [
        'https://images.unsplash.com/photo-1583496661160-fb5886a13d4e?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Navy', 'Burgundy'],
      inStock: false,
      stock: 0,
      stockQuantity: 0,
      rating: 4.3,
      reviewCount: 92,
      tags: ['trendy', 'mini', 'pleated'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-04-01'),
    },
  ];

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm
  getProducts(): Observable<Product[]> {
    // For now, return mock data. Replace with real API call later
    return of(this.mockProducts).pipe(delay(500));
  }
  // Lấy chi tiết sản phẩm theo ID
  getProduct(id: string): Observable<Product> {
    const product = this.mockProducts.find((p) => p.id === id);
    if (product) {
      return of(product).pipe(delay(300));
    }
    throw new Error('Product not found');
  }

  // Tìm kiếm và lọc sản phẩm
  filterProducts(filter: ProductFilter): Observable<Product[]> {
    let filteredProducts = [...this.mockProducts];

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filter.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filter.category
      );
    }

    if (filter.brand) {
      filteredProducts = filteredProducts.filter(
        (p) => p.brand === filter.brand
      );
    }

    if (filter.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filter.priceMin!
      );
    }

    if (filter.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filter.priceMax!
      );
    }

    if (filter.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.inStock === filter.inStock
      );
    }

    return of(filteredProducts).pipe(delay(400));
  }
  // Thêm sản phẩm mới
  addProduct(product: Product): Observable<Product> {
    const newProduct = {
      ...product,
      id: (
        Math.max(...this.mockProducts.map((p) => parseInt(p.id))) + 1
      ).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  // Cập nhật sản phẩm
  updateProduct(product: Product): Observable<Product> {
    const index = this.mockProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.mockProducts[index] = { ...product, updatedAt: new Date() };
      return of(this.mockProducts[index]).pipe(delay(500));
    }
    throw new Error('Product not found');
  }

  // Xóa sản phẩm
  deleteProduct(id: string): Observable<void> {
    const index = this.mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Product not found');
  }
}
