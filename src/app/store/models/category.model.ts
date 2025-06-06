export interface Category {
  CategoryID: number;
  CategoryName: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateCategoryRequest {
  CategoryName: string;
}

export interface UpdateCategoryRequest {
  CategoryID: number;
  CategoryName: string;
  IsActive: boolean;
}
