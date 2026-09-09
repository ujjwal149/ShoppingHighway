import type {
  ApiResponse,
  ApiMessageResponse,
} from "./api";

export type AddressLabel =
  | "HOME"
  | "OFFICE"
  | "OTHER";

export interface CustomerAddress {
  id: number;

  label: AddressLabel;
  customLabel: string | null;

  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2: string | null;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  isDefault: boolean;

  customerId: number;

  createdAt: string;
  updatedAt: string;

  
}

export interface CreateAddressInput {
  label: AddressLabel;

  customLabel?: string | null;

  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string | null;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  isDefault?: boolean;
}

export interface UpdateAddressInput
  extends Partial<CreateAddressInput> {}

export type AddressesResponse =
  ApiResponse<CustomerAddress[]>;

export type AddressResponse =
  ApiMessageResponse<CustomerAddress>;