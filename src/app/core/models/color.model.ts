export interface Color {
  colorID: number;
  colorName: string;
  colorCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
