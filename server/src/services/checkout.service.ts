import {
  db,
} from "../prisma/db";

import {
  param,
} from "@prisma/orm-postgres/relational-core/expression";

export const prepareCheckout =
  async (
    customerId: number,
    addressId: number,
  ) => {
    
    const address =
      await db.orm.public.CustomerAddress
        .where({
          id: addressId,
          customerId,
        })
        .first();

    if (!address) {
      throw new Error(
        "ADDRESS_NOT_FOUND",
      );
    }

    
    const cart =
      await db.orm.public.Cart
        .where({
          customerId,
        })
        .include(
          "items",
          (items) =>
            items.include(
              "variant",
              (variant) =>
                variant
                  .include(
                    "product",
                  )
                  .include(
                    "inventory",
                  ),
            ),
        )
        .first();

    if (
      !cart ||
      cart.items.length === 0
    ) {
      throw new Error(
        "CART_EMPTY",
      );
    }

    let totalAmount = 0;

    const checkoutItems =
      cart.items.map((item) => {
        const variant =
          item.variant;

        const product =
          variant.product;

        const inventory =
          variant.inventory;

        if (!inventory) {
          throw new Error(
            "INVENTORY_NOT_FOUND",
          );
        }

        
        const quantity =
          item.quantity;

        if (
          typeof quantity !== "number" ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          throw new Error(
            "INVALID_CART_QUANTITY",
          );
        }

        if (
          inventory.quantity <
          quantity
        ) {
          throw new Error(
            "INSUFFICIENT_STOCK",
          );
        }

        const unitPrice =
          product.price;

        const lineTotal =
          unitPrice *
          quantity;

        totalAmount +=
          lineTotal;

        return {
          cartItemId:
            item.id,

          variantId:
            variant.id,

          sku:
            variant.sku,

          size:
            variant.size,

          productId:
            product.id,

          productName:
            product.name,

          imageUrl:
            product.imageUrl,

          quantity,

          availableStock:
            inventory.quantity,

          unitPrice,

          lineTotal,
        };
     });

    return {
      address: {
        id:
          address.id,

        label:
          address.label,

        customLabel:
          address.customLabel,

        fullName:
          address.fullName,

        phone:
          address.phone,

        addressLine1:
          address.addressLine1,

        addressLine2:
          address.addressLine2,

        city:
          address.city,

        state:
          address.state,

        postalCode:
          address.postalCode,

        country:
          address.country,
      },

      items:
        checkoutItems,

      totalAmount,
    };
  };

  export const createPendingOrder =
  async (
    customerId: number,
    addressId: number,
  ) => {
    return db.transaction(
      async (tx) => {

        //Verify the address
        const address =
          await tx.orm.public.CustomerAddress
            .where({
              id: addressId,
              customerId,
            })
            .first();

        if (!address) {
          throw new Error(
            "ADDRESS_NOT_FOUND",
          );
        }

      //Reload the customer cart,(because whit time price and stock might have changed.)
        const cart =
          await tx.orm.public.Cart
            .where({
              customerId,
            })
            .include(
              "items",
              (items) =>
                items.include(
                  "variant",
                  (variant) =>
                    variant
                      .include(
                        "product",
                      )
                      .include(
                        "inventory",
                      ),
                ),
            )
            .first();

        if (
          !cart ||
          cart.items.length === 0
        ) {
          throw new Error(
            "CART_EMPTY",
          );
        }

       

        let totalAmount = 0;

        const orderItems =
          cart.items.map(
            (item) => {
              const quantity =
                item.quantity;

              if (
                typeof quantity !==
                  "number" ||
                !Number.isInteger(
                  quantity,
                ) ||
                quantity <= 0
              ) {
                throw new Error(
                  "INVALID_CART_QUANTITY",
                );
              }

              const variant =
                item.variant;

              const product =
                variant.product;

              const inventory =
                variant.inventory;

              if (!inventory) {
                throw new Error(
                  "INVENTORY_NOT_FOUND",
                );
              }

              const unitPrice =
                product.price;

              const lineTotal =
                unitPrice *
                quantity;

              totalAmount +=
                lineTotal;

              return {
                variantId:
                  variant.id,

                quantity,

                unitPrice,
              };
            },
          );

        
        for (
          const item
          of orderItems
        ) {
          const requestedQuantity =
            param(
              item.quantity,
              {
                codecId:
                  "pg/int4@1",
              },
            );

          const reservePlan =
            tx.sql.public.inventory
              .update(
                (
                  fields,
                  fns,
                ) => ({
                  quantity:
                    fns.raw`
                      ${fields.quantity}
                      -
                      ${requestedQuantity}
                    `.returns(
                      "pg/int4@1",
                    ),
                }),
              )
              .where(
                (
                  fields,
                  fns,
                ) =>
                  fns.and(
                    fns.eq(
                      fields.variantId,
                      item.variantId,
                    ),

                    fns.gte(
                      fields.quantity,
                      item.quantity,
                    ),
                  ),
              )
              .build();

          const reserveResult =
              await tx.execute(
                reservePlan,
              );
          
            if (
              reserveResult.affectedRows ===
              0
            ) {
              throw new Error(
                "INSUFFICIENT_STOCK",
              );
            }
        }

        // Create pending Order
         

        const order =
          await tx.orm.public.Order.create({
            customerId,

            totalAmount,

            status:
              "PENDING",
          });

        
         // Create immutable OrderItems


        for (
          const item
          of orderItems
        ) {
          await tx.orm.public.OrderItem.create({
            orderId:
              order.id,

            variantId:
              item.variantId,

            quantity:
              item.quantity,

            unitPrice:
              item.unitPrice,
          });
        }

    
        // Copy shipping address
         
        await tx.orm.public.OrderShippingAddress.create({
          orderId:
            order.id,

          fullName:
            address.fullName,

          phone:
            address.phone,

          addressLine1:
            address.addressLine1,

          addressLine2:
            address.addressLine2,

          city:
            address.city,

          state:
            address.state,

          postalCode:
            address.postalCode,

          country:
            address.country,
        });

      
        // Create pending Payment
         

        const payment =
          await tx.orm.public.Payment.create({
            orderId:
              order.id,

            amount:
              totalAmount,

            status:
              "PENDING",

            stripePaymentIntentId:
              null,
          });

        /*
         * Don't clear the cart yet.
         *
         * Payment has not succeeded.
         */

        return {
          orderId:
            order.id,

          paymentId:
            payment.id,

          totalAmount:
            order.totalAmount,

          orderStatus:
            order.status,

          paymentStatus:
            payment.status,
        };
      },
    );
  };

  export const releasePendingOrderReservation =
  async (
    customerId: number,
    orderId: number,
    paymentId: number,
  ) => {
    return db.transaction(
      async (tx) => {
        const order =
          await tx.orm.public.Order
            .where({
              id: orderId,
              customerId,
            })
            .include("items")
            .first();

        if (!order) {
          throw new Error(
            "ORDER_NOT_FOUND",
          );
        }

        const payment =
          await tx.orm.public.Payment
            .where({
              id: paymentId,
              orderId,
            })
            .first();

        if (!payment) {
          throw new Error(
            "PAYMENT_NOT_FOUND",
          );
        }

        /*
         * Important idempotency protection.
         *
         * If compensation already happened,
         * don't restore inventory again.
         */
        if (
          order.status !== "PENDING" ||
          payment.status !== "PENDING"
        ) {
          return;
        }

        /*
         * Restore every reserved quantity.
         */
        for (const item of order.items) {
          const quantity =
            item.quantity;
                
          const variantId =
            item.variantId;
                
          if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity <= 0
          ) {
            throw new Error(
              "INVALID_ORDER_QUANTITY",
            );
          }
        
          if (
            typeof variantId !== "number" ||
            !Number.isInteger(variantId) ||
            variantId <= 0
          ) {
            throw new Error(
              "INVALID_VARIANT_ID",
            );
          }

          if (
            typeof quantity !== "number" ||
            !Number.isInteger(quantity) ||
            quantity <= 0
          ) {
            throw new Error(
              "INVALID_ORDER_QUANTITY",
            );
          }

          const restoreQuantity =
            param(
              quantity,
              {
                codecId:
                  "pg/int4@1",
              },
            );

          const restorePlan =
            tx.sql.public.inventory
              .update(
                (
                  fields,
                  fns,
                ) => ({
                  quantity:
                    fns.raw`
                      ${fields.quantity}
                      +
                      ${restoreQuantity}
                    `.returns(
                      "pg/int4@1",
                    ),
                }),
              )
              .where(
                (
                  fields,
                  fns,
                ) =>
                  fns.eq(
                    fields.variantId,
                    variantId,
                  ),
              )
              .build();

          const result =
            await tx.execute(
              restorePlan,
            );

          if (
            result.affectedRows === 0
          ) {
            throw new Error(
              "INVENTORY_NOT_FOUND",
            );
          }
        }

        await tx.orm.public.Payment
          .where({
            id: payment.id,
          })
          .update({
            status: "FAILED",
          });

        await tx.orm.public.Order
          .where({
            id: order.id,
          })
          .update({
            status:
              "PAYMENT_FAILED",
          });
      },
    );
  };