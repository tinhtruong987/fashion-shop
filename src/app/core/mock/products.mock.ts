import { Product } from '../models/product.model';
import { MOCK_CATEGORIES } from './categories.mock';
import { MOCK_SIZES } from './sizes.mock';
import { MOCK_COLORS } from './colors.mock';
import { Category } from '../models/category.model';
import { ProductVariant } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    productID: 1,
    productCode: 'TS001',
    name: 'Áo thun basic',
    categoryID: 1,
    price: 150000,
    description: 'Áo thun basic chất liệu cotton 100%',
    image: 'assets/images/products/tshirt-basic.jpg',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
    category: MOCK_CATEGORIES[0],
    variants: [
      {
        variantID: 1,
        productID: 1,
        sizeID: 1,
        colorID: 1,
        stock: 50,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: null,
        size: MOCK_SIZES[0],
        color: MOCK_COLORS[0],
      },
      {
        variantID: 2,
        productID: 1,
        sizeID: 2,
        colorID: 1,
        stock: 50,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: null,
        size: MOCK_SIZES[1],
        color: MOCK_COLORS[0],
      },
    ],
  },
  {
    productID: 2,
    productCode: 'QJ001',
    name: 'Quần jean slim fit',
    categoryID: 2,
    price: 350000,
    description: 'Quần jean slim fit chất liệu denim',
    image: 'assets/images/products/jean-slim.jpg',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
    category: MOCK_CATEGORIES[1],
    variants: [
      {
        variantID: 3,
        productID: 2,
        sizeID: 2,
        colorID: 4,
        stock: 30,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: null,
        size: MOCK_SIZES[1],
        color: MOCK_COLORS[3],
      },
      {
        variantID: 4,
        productID: 2,
        sizeID: 3,
        colorID: 4,
        stock: 30,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: null,
        size: MOCK_SIZES[2],
        color: MOCK_COLORS[3],
      },
    ],
  },
];
