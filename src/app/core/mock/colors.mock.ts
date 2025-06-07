import { Color } from '../models/color.model';

export const MOCK_COLORS: Color[] = [
  {
    colorID: 1,
    colorName: 'Đỏ',
    colorCode: '#FF0000',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
  {
    colorID: 2,
    colorName: 'Xanh',
    colorCode: '#0000FF',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
  {
    colorID: 3,
    colorName: 'Đen',
    colorCode: '#000000',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
  {
    colorID: 4,
    colorName: 'Trắng',
    colorCode: '#FFFFFF',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: null,
  },
];
