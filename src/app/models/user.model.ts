export interface UserAccount {
  userAccountID?: number;
  username: string;
  passwordHash: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  staff?: Staff;
}

export interface Staff {
  staffID: number;
  userAccountID: number;
  name: string;
  position: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userAccount?: UserAccount;
}

export interface Customer {
  customerID: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  loyaltyPoints: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Admin = 'Admin',
  Staff = 'Staff',
}
