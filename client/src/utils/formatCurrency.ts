export const formatCurrency = (
  amountInPaise: number,
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(amountInPaise / 100);
};