import {
  stripe,
} from "../config/stripe";

import {
  db,
} from "../prisma/db";

import type Stripe from "stripe";

import {
  releasePendingOrderReservation,
} from "./checkout.service";

export const createPaymentIntent =
  async (
    customerId: number,
    orderId: number,
    paymentId: number,
  ) => {
   
    
    const payment =
      await db.orm.public.Payment
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

    const order =
      await db.orm.public.Order
        .where({
          id: orderId,
          customerId,
        })
        .first();

    if (!order) {
      throw new Error(
        "ORDER_NOT_FOUND",
      );
    }

    if (
      order.status !==
      "PENDING"
    ) {
      throw new Error(
        "ORDER_NOT_PENDING",
      );
    }

    
    const stripeAmount =
      payment.amount;

    const paymentIntent =
      await stripe
        .paymentIntents
        .create(
          {
            amount:
              stripeAmount,

            currency:
              "inr",

            
            payment_method_types: [
              "card",
            ],

            metadata: {
              orderId:
                String(
                  order.id,
                ),

              paymentId:
                String(
                  payment.id,
                ),

              customerId:
                String(
                  customerId,
                ),
            },
          },

          
          {
            idempotencyKey:
              `shoppinghighway-order-${order.id}`,
          },
        );

    
    await db.orm.public.Payment
      .where({
        id: payment.id,
      })
      .update({
        stripePaymentIntentId:
          paymentIntent.id,
      });

    if (
      !paymentIntent.client_secret
    ) {
      throw new Error(
        "PAYMENT_INTENT_CLIENT_SECRET_MISSING",
      );
    }

    return {
      orderId:
        order.id,

      paymentId:
        payment.id,

      amount:
        payment.amount,

      stripePaymentIntentId:
        paymentIntent.id,

      clientSecret:
        paymentIntent.client_secret,
    };
  };

 export const handleSuccessfulPayment =
  async (
    paymentIntent:
      Stripe.PaymentIntent,
  ) => {
    return db.transaction(
      async (tx) => {
        const payment =
          await tx.orm.public.Payment
            .where({
              stripePaymentIntentId:
                paymentIntent.id,
            })
            .first();

        if (!payment) {
          throw new Error(
            "PAYMENT_NOT_FOUND",
          );
        }

        
        if (
          payment.status !==
            "PENDING" &&
          payment.status !==
            "SUCCEEDED"
        ) {
          throw new Error(
            "PAYMENT_INVALID_STATUS",
          );
        }

        const order =
          await tx.orm.public.Order
            .where({
              id:
                payment.orderId,
            })
            .first();

        if (!order) {
          throw new Error(
            "ORDER_NOT_FOUND",
          );
        }

        
        const expectedAmount =
          payment.amount;

        

        if (
          paymentIntent.amount !==
            expectedAmount ||
          paymentIntent
            .amount_received !==
            expectedAmount ||
          paymentIntent.currency !==
            "inr"
        ) {
          throw new Error(
            "PAYMENT_AMOUNT_MISMATCH",
          );
        }

        
        if (
          payment.status ===
          "PENDING"
        ) {
          await tx.orm.public.Payment
            .where({
              id:
                payment.id,
            })
            .update({
              status:
                "SUCCEEDED",
            });
        }

        if (
          order.status !==
          "PAID"
        ) {
          await tx.orm.public.Order
            .where({
              id:
                order.id,
            })
            .update({
              status:
                "PAID",
            });
        }

        const cart =
          await tx.orm.public.Cart
            .where({
              customerId:
                order.customerId,
            })
            .first();

        console.log(
          "Cart lookup after payment:",
          {
            customerId:
              order.customerId,

            cartId:
              cart?.id ?? null,
          },
        );

        if (cart) {
          const cartItems =
            await tx.orm.public.CartItem
              .where({
                cartId:
                  cart.id,
              })
              .all();

          console.log(
            "Cart items before cleanup:",
            cartItems.length,
          );

          for (
            const cartItem
            of cartItems
          ) {
            console.log(
              "Deleting cart item:",
              cartItem.id,
            );

            await tx.orm.public.CartItem
              .where({
                id:
                  cartItem.id,
              })
              .delete();
          }

          
          const remainingItems =
            await tx.orm.public.CartItem
              .where({
                cartId:
                  cart.id,
              })
              .all();

          console.log(
            "Cart items after cleanup:",
            remainingItems.length,
          );
        }

        console.log(
          `Payment completed for order ${order.id}`,
        );

        return {
          orderId:
            order.id,

          paymentId:
            payment.id,
        };
      },
    );
  };

  export const handleFailedPayment =
  async (
    paymentIntent:
      Stripe.PaymentIntent,
  ) => {
    const payment =
      await db.orm.public.Payment
        .where({
          stripePaymentIntentId:
            paymentIntent.id,
        })
        .first();

    if (!payment) {
      throw new Error(
        "PAYMENT_NOT_FOUND",
      );
    }

    
    if (
      payment.status !==
      "PENDING"
    ) {
      return;
    }

    const order =
      await db.orm.public.Order
        .where({
          id:
            payment.orderId,
        })
        .first();

    if (!order) {
      throw new Error(
        "ORDER_NOT_FOUND",
      );
    }

    
    await releasePendingOrderReservation(
      order.customerId,
      order.id,
      payment.id,
    );
  };