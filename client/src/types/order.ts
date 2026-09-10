export type OrderProduct = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

export type OrderVariant = {
  id: number;
  sku: string;
  size: string;
  product: OrderProduct;
};

export type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  variantId: number;
  variant: OrderVariant;
};

export type OrderPayment = {
  id: number;
  amount: number;
  status: string;

  stripePaymentIntentId:
    string | null;
};

export type OrderShippingAddress = {
  fullName: string;
  phone: string;

  addressLine1: string;

  addressLine2:
    string | null;

  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CustomerOrder = {
  id: number;

  totalAmount: number;

  status: string;

  createdAt: string;

  items: OrderItem[];

  payment:
    OrderPayment | null;

  shippingAddress:
    OrderShippingAddress | null;
};

export type OrdersResponse = {
  success: boolean;

  data: CustomerOrder[];
};