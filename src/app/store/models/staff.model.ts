export interface UserAccount {
  UserAccountID: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  Role: 'Staff' | 'Admin';
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface Staff {
  StaffID: number;
  UserAccountID: number;
  Name: string;
  Position?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  UserAccount?: UserAccount;
}

export interface CreateStaffRequest {
  Username: string;
  Password: string;
  Email: string;
  Role: 'Staff' | 'Admin';
  Name: string;
  Position?: string;
}

export interface UpdateStaffRequest {
  StaffID: number;
  Name: string;
  Position?: string;
  IsActive: boolean;
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  staff: Staff;
}
