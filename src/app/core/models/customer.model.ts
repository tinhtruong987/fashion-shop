export interface Customer {
  customerID: number;
  userID: number;
  name: string;
  address: string;
  rewardPoints: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
