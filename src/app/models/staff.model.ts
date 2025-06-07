export interface Staff {
  staffID: number;
  userAccountID: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffWithAccount extends Staff {
  userAccount: {
    username: string;
    role: 'ADMIN' | 'STAFF';
    isActive: boolean;
  };
}
