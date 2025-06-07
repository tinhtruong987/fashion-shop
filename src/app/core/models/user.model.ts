export interface User {
  userID: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  isActive: boolean;
  rewardPoints?: number;
  createdAt: Date;
  updatedAt: Date | null;
}
