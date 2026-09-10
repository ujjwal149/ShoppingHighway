import {
  db,
} from "../prisma/db";

export const getCustomerOrders =
  async (
    customerId: number,
  ) => {
    const orders =
      await db.orm.public.Order
        .where({
          customerId,
        })
        .include(
          "items",
          (items) =>
            items.include(
              "variant",
              (variant) =>
                variant.include(
                  "product",
                ),
            ),
        )
        .include(
          "payment",
        )
        .include(
          "shippingAddress",
        )
        .all();

    return orders;
  };