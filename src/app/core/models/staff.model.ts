export interface Staff {
  staffID: number;
  userAccountID: number;
  name: string;
  position: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  userAccount?: UserAccount;
}

export interface UserAccount {
  userAccountID: number;
  username: string;
  passwordHash: string;
  email: string;
  role: 'Staff' | 'Admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
