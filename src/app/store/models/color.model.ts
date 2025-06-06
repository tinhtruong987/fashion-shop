export interface Color {
  ColorID: number;
  ColorName: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CreateColorRequest {
  ColorName: string;
}

export interface UpdateColorRequest {
  ColorID: number;
  ColorName: string;
  IsActive: boolean;
}
