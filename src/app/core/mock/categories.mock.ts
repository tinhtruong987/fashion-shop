import { Category } from '../models/category.model';

export const MOCK_CATEGORIES: Category[] = [
  {
    categoryID: 1,
    categoryName: 'Áo thun',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
  {
    categoryID: 2,
    categoryName: 'Quần jean',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
  {
    categoryID: 3,
    categoryName: 'Giày',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
];
