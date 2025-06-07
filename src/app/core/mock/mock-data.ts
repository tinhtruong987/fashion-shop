import { Product, ProductVariant } from '../models/product.model';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';
import { Order } from '../models/order.model';
import { Size } from '../models/size.model';
import { Color } from '../models/color.model';

export const MOCK_USERS: User[] = [
  {
    userID: 1,
    username: 'admin',
    password: 'admin123',
    fullName: 'Admin User',
    email: 'admin@example.com',
    phone: '0123456789',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    userID: 2,
    username: 'staff1',
    password: 'staff123',
    fullName: 'Staff User',
    email: 'staff@example.com',
    phone: '0123456788',
    role: 'STAFF',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    userID: 3,
    username: 'customer1',
    password: 'customer123',
    fullName: 'Customer User',
    email: 'customer@example.com',
    phone: '0123456787',
    role: 'CUSTOMER',
    isActive: true,
    rewardPoints: 100,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    customerID: 1,
    userID: 3,
    name: 'Nguyễn Văn A',
    email: 'customer@example.com',
    address: '123 Street, City',
    rewardPoints: 100,
    totalSpent: 1000000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_SIZES: Size[] = [
  {
    sizeID: 1,
    sizeName: 'S',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    sizeID: 2,
    sizeName: 'M',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    sizeID: 3,
    sizeName: 'L',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    sizeID: 4,
    sizeName: 'XL',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_COLORS: Color[] = [
  {
    colorID: 1,
    colorName: 'Đỏ',
    colorCode: '#FF0000',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    colorID: 2,
    colorName: 'Xanh',
    colorCode: '#0000FF',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    colorID: 3,
    colorName: 'Đen',
    colorCode: '#000000',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    colorID: 4,
    colorName: 'Trắng',
    colorCode: '#FFFFFF',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    categoryID: 1,
    categoryName: 'Áo thun',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    categoryID: 2,
    categoryName: 'Quần jean',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    productID: 1,
    productCode: 'TSHIRT01',
    categoryID: 1,
    name: 'Áo thun basic',
    description: 'Áo thun basic chất liệu cotton',
    price: 200000,
    image: 'assets/images/products/tshirt-basic.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    productID: 2,
    productCode: 'JEAN01',
    categoryID: 2,
    name: 'Quần jean slim',
    description: 'Quần jean slim fit',
    price: 500000,
    image: 'assets/images/products/jean-slim.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_VARIANTS: ProductVariant[] = [
  {
    variantID: 1,
    productID: 1,
    sizeID: 1,
    colorID: 1,
    stock: 100,
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
  {
    variantID: 2,
    productID: 1,
    sizeID: 2,
    colorID: 2,
    stock: 100,
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    orderID: 1,
    customerID: 1,
    staffID: 2,
    orderDate: new Date(),
    totalAmount: 200000,
    discountAmount: 0,
    finalAmount: 200000,
    status: 'COMPLETED',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    items: [
      {
        orderItemID: 1,
        orderID: 1,
        variantID: 1,
        quantity: 1,
        price: 200000,
        discount: 0,
        total: 200000,
      },
    ],
    createdAt: new Date(),
    updatedAt: null,
  },
];
