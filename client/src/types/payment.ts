export type StartPaymentData = {
  orderId: number;
  paymentId: number;
  amount: number;
  stripePaymentIntentId: string;
  clientSecret: string;
};

export type StartPaymentResponse = {
  success: boolean;
  message: string;
  data: StartPaymentData;
};