export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFilter {
  searchTerm?: string;
  membershipLevel?: string;
  minLoyaltyPoints?: number;
}

export interface LoyaltyDiscount {
  level: string;
  discountPercentage: number;
  minPoints: number;
}
