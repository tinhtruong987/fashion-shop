export interface Size {
  SizeID: number;
  SizeName: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateSizeRequest {
  SizeName: string;
}

export interface UpdateSizeRequest {
  SizeID: number;
  SizeName: string;
  IsActive: boolean;
}
