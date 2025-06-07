import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductFilter } from './model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/products'; // URL backend
  // Mock data for demonstration with over 50 products
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
    {
      id: '6',
      code: 'DRESS_006',
      name: 'Floral Maxi Dress',
      description:
        'Long floral dress with a beautiful pattern. Ideal for summer days and beach vacations.',
      category: 'Dresses',
      brand: 'Summer Vibes',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Floral Print', 'Blue Floral'],
      inStock: true,
      stock: 18,
      stockQuantity: 18,
      rating: 4.6,
      reviewCount: 75,
      tags: ['summer', 'floral', 'maxi'],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-03-10'),
    },
    {
      id: '7',
      code: 'JEANS_007',
      name: 'High Waist Jeans',
      description:
        'Trendy high-waisted jeans that hug your curves in all the right places.',
      category: 'Jeans',
      brand: 'Denim Republic',
      price: 69.99,
      images: [
        'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=500',
      ],
      sizes: ['26', '28', '30', '32', '34'],
      colors: ['Dark Wash', 'Light Wash', 'Black'],
      inStock: true,
      stock: 22,
      stockQuantity: 22,
      rating: 4.7,
      reviewCount: 104,
      tags: ['high-waist', 'trendy', 'jeans'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-04-02'),
    },
    {
      id: '8',
      code: 'SHOES_008',
      name: 'Classic Leather Sneakers',
      description:
        'Timeless leather sneakers that go with any outfit. Comfortable for all-day wear.',
      category: 'Shoes',
      brand: 'Sole Comfort',
      price: 89.99,
      originalPrice: 105.99,
      discount: 15,
      images: [
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
      ],
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
      colors: ['White', 'Black', 'Tan'],
      inStock: true,
      stock: 35,
      stockQuantity: 35,
      rating: 4.8,
      reviewCount: 215,
      tags: ['sneakers', 'classic', 'leather'],
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-22'),
    },
    {
      id: '9',
      code: 'SHIRT_009',
      name: 'Striped Button-Up Shirt',
      description:
        'Professional striped button-up shirt for a polished office look.',
      category: 'Shirts',
      brand: 'Business Casual',
      price: 54.99,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue/White Stripes', 'Black/White Stripes'],
      inStock: true,
      stock: 28,
      stockQuantity: 28,
      rating: 4.5,
      reviewCount: 86,
      tags: ['formal', 'office', 'striped'],
      createdAt: new Date('2024-02-12'),
      updatedAt: new Date('2024-04-03'),
    },
    {
      id: '10',
      code: 'BLOUSE_010',
      name: 'Satin Blouse',
      description:
        'Elegant satin blouse with a luxurious feel. Perfect for work or evening events.',
      category: 'Shirts',
      brand: 'Eleganza',
      price: 65.99,
      originalPrice: 75.99,
      discount: 13,
      images: [
        'https://images.unsplash.com/photo-1560834227-8b9e393f5e4d?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Ivory', 'Burgundy', 'Navy'],
      inStock: true,
      stock: 20,
      stockQuantity: 20,
      rating: 4.6,
      reviewCount: 92,
      tags: ['elegant', 'satin', 'blouse'],
      createdAt: new Date('2024-02-08'),
      updatedAt: new Date('2024-03-28'),
    },
    {
      id: '11',
      code: 'JACKET_011',
      name: 'Denim Jacket',
      description:
        'Classic denim jacket that never goes out of style. Perfect for layering in any season.',
      category: 'Jackets',
      brand: 'Denim Works',
      price: 69.99,
      images: [
        'https://images.unsplash.com/photo-1527016021513-b09758b777bc?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue Denim', 'Black Denim'],
      inStock: true,
      stock: 24,
      stockQuantity: 24,
      rating: 4.7,
      reviewCount: 136,
      tags: ['denim', 'casual', 'jacket'],
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: '12',
      code: 'SWEATER_012',
      name: 'Knit Turtleneck Sweater',
      description:
        'Warm knit turtleneck sweater for cold weather. Soft and comfortable material.',
      category: 'Sweaters',
      brand: 'Warm Essentials',
      price: 59.99,
      originalPrice: 75.99,
      discount: 21,
      images: [
        'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Cream', 'Navy', 'Burgundy', 'Forest Green'],
      inStock: true,
      stock: 30,
      stockQuantity: 30,
      rating: 4.4,
      reviewCount: 82,
      tags: ['winter', 'turtleneck', 'knit'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-28'),
    },
    {
      id: '13',
      code: 'DRESS_013',
      name: 'Little Black Dress',
      description:
        'The essential little black dress for any wardrobe. Elegant, versatile and timeless.',
      category: 'Dresses',
      brand: 'Classic Couture',
      price: 99.99,
      images: [
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black'],
      inStock: true,
      stock: 15,
      stockQuantity: 15,
      rating: 4.9,
      reviewCount: 178,
      tags: ['classic', 'black', 'elegant'],
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-04-05'),
    },
    {
      id: '14',
      code: 'TSHIRT_014',
      name: 'Organic Cotton T-Shirt',
      description:
        'Eco-friendly organic cotton t-shirt with a relaxed fit. Sustainable and comfortable.',
      category: 'T-Shirts',
      brand: 'Eco Threads',
      price: 29.99,
      originalPrice: 34.99,
      discount: 14,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Grey', 'Navy', 'Sage'],
      inStock: true,
      stock: 50,
      stockQuantity: 50,
      rating: 4.3,
      reviewCount: 210,
      tags: ['organic', 'sustainable', 'basic'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-18'),
    },
    {
      id: '15',
      code: 'SHORTS_015',
      name: 'Chino Shorts',
      description:
        'Classic chino shorts for casual summer days. Comfortable and versatile.',
      category: 'Shorts',
      brand: 'Summer Basics',
      price: 44.99,
      images: [
        'https://images.unsplash.com/photo-1625593086326-77a9df7cbee7?w=500',
      ],
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Beige', 'Navy', 'Olive'],
      inStock: true,
      stock: 32,
      stockQuantity: 32,
      rating: 4.5,
      reviewCount: 94,
      tags: ['summer', 'casual', 'shorts'],
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-04-08'),
    },
    {
      id: '16',
      code: 'SWIMSUIT_016',
      name: 'One-Piece Swimsuit',
      description:
        'Stylish one-piece swimsuit with a flattering cut. Perfect for beach days.',
      category: 'Swimwear',
      brand: 'Beach Life',
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      images: [
        'https://images.unsplash.com/photo-1570900865656-c9543cc14fa3?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Emerald'],
      inStock: true,
      stock: 18,
      stockQuantity: 18,
      rating: 4.6,
      reviewCount: 68,
      tags: ['swimwear', 'beach', 'summer'],
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-04-12'),
    },
    {
      id: '17',
      code: 'SHOES_017',
      name: 'Leather Ankle Boots',
      description:
        'Stylish leather ankle boots with a small heel. Versatile and comfortable for everyday wear.',
      category: 'Shoes',
      brand: 'Urban Walker',
      price: 129.99,
      originalPrice: 149.99,
      discount: 13,
      images: [
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500',
      ],
      sizes: ['36', '37', '38', '39', '40', '41'],
      colors: ['Black', 'Brown', 'Tan'],
      inStock: true,
      stock: 22,
      stockQuantity: 22,
      rating: 4.8,
      reviewCount: 153,
      tags: ['boots', 'leather', 'ankle'],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-03-25'),
    },
    {
      id: '18',
      code: 'BAG_018',
      name: 'Leather Crossbody Bag',
      description:
        'Stylish leather crossbody bag with multiple compartments. Perfect for everyday use.',
      category: 'Accessories',
      brand: 'Style Maven',
      price: 89.99,
      images: [
        'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=500',
      ],
      sizes: ['One Size'],
      colors: ['Black', 'Brown', 'Tan'],
      inStock: true,
      stock: 15,
      stockQuantity: 15,
      rating: 4.7,
      reviewCount: 89,
      tags: ['accessories', 'leather', 'bag'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-04-01'),
    },
    {
      id: '19',
      code: 'HOODIE_019',
      name: 'Oversized Hoodie',
      description:
        'Comfortable oversized hoodie perfect for lounging or casual outings.',
      category: 'Sweaters',
      brand: 'Comfort Zone',
      price: 49.99,
      originalPrice: 59.99,
      discount: 17,
      images: [
        'https://images.unsplash.com/photo-1572495641004-28421ae52e52?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Grey', 'Black', 'Navy', 'Burgundy'],
      inStock: true,
      stock: 40,
      stockQuantity: 40,
      rating: 4.5,
      reviewCount: 187,
      tags: ['casual', 'hoodie', 'oversized'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-03-20'),
    },
    {
      id: '20',
      code: 'PANTS_020',
      name: 'Wide-Leg Trousers',
      description:
        'Stylish wide-leg trousers perfect for office or fancy occasions.',
      category: 'Pants',
      brand: 'Modern Professional',
      price: 69.99,
      images: [
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Beige', 'Navy'],
      inStock: true,
      stock: 25,
      stockQuantity: 25,
      rating: 4.6,
      reviewCount: 76,
      tags: ['formal', 'trousers', 'office'],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-30'),
    },
    {
      id: '21',
      code: 'SCARF_021',
      name: 'Cashmere Scarf',
      description:
        'Luxuriously soft cashmere scarf to keep you warm and stylish during cold months.',
      category: 'Accessories',
      brand: 'Luxury Touch',
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      images: [
        'https://images.unsplash.com/photo-1584184924103-e310d9dc82fc?w=500',
      ],
      sizes: ['One Size'],
      colors: ['Camel', 'Grey', 'Navy', 'Burgundy'],
      inStock: true,
      stock: 20,
      stockQuantity: 20,
      rating: 4.9,
      reviewCount: 62,
      tags: ['winter', 'cashmere', 'accessories'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
    },
    {
      id: '22',
      code: 'SHIRT_022',
      name: 'Flannel Shirt',
      description: 'Cozy flannel shirt perfect for fall and winter layering.',
      category: 'Shirts',
      brand: 'Woodland',
      price: 54.99,
      images: [
        'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500',
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Red/Black Check', 'Green/Blue Check', 'Grey/Black Check'],
      inStock: true,
      stock: 35,
      stockQuantity: 35,
      rating: 4.7,
      reviewCount: 104,
      tags: ['flannel', 'casual', 'winter'],
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-04-01'),
    },
    {
      id: '23',
      code: 'DRESS_023',
      name: 'Wrap Dress',
      description:
        'Flattering wrap dress suitable for work or social occasions.',
      category: 'Dresses',
      brand: 'Modern Woman',
      price: 74.99,
      originalPrice: 89.99,
      discount: 17,
      images: [
        'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=500',
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Forest Green', 'Burgundy'],
      inStock: true,
      stock: 28,
      stockQuantity: 28,
      rating: 4.6,
      reviewCount: 95,
      tags: ['wrap', 'versatile', 'elegant'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-15'),
    },
    {
      id: '24',
      code: 'SUNGLASSES_024',
      name: 'Polarized Sunglasses',
      description:
        'Stylish polarized sunglasses with UV protection. Perfect for bright days.',
      category: 'Accessories',
      brand: 'Sun Style',
      price: 49.99,
      originalPrice: 69.99,
      discount: 28,
      images: [
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
      ],
      sizes: ['One Size'],
      colors: ['Black', 'Tortoise Shell', 'Navy'],
      inStock: true,
      stock: 45,
      stockQuantity: 45,
      rating: 4.5,
      reviewCount: 118,
      tags: ['summer', 'sunglasses', 'accessories'],
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-30'),
    },
    {
      id: '25',
      code: 'SHOES_025',
      name: 'Canvas Sneakers',
      description:
        'Comfortable canvas sneakers perfect for casual everyday wear.',
      category: 'Shoes',
      brand: 'Street Step',
      price: 39.99,
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500',
      ],
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      colors: ['White', 'Black', 'Navy', 'Red'],
      inStock: true,
      stock: 60,
      stockQuantity: 60,
      rating: 4.4,
      reviewCount: 245,
      tags: ['canvas', 'casual', 'sneakers'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-05'),
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
