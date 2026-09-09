export interface AuthCustomer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthCustomer;
}

export interface CurrentCustomerResponse {
  success: boolean;
  data: AuthCustomer;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}