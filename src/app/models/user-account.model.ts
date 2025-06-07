export interface UserAccount {
  userAccountID: number;
  username: string;
  password: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAccountWithStaff extends UserAccount {
  staff: {
    staffID: number;
    name: string;
    position: string;
  } | null;
}
