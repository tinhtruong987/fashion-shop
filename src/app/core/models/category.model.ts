export interface Category {
  categoryID: number;
  categoryName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
