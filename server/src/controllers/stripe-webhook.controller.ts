import type { Request, Response } from "express";
import Stripe from "stripe";

import { stripe } from "../config/stripe";

import {
  handleSuccessfulPayment,
  handleFailedPayment,
} from "../services/payment.service";

export async function stripeWebhook(
  req: Request,
  res: Response,
) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
    });
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured",
    );

    return res.status(500).json({
      success: false,
      message: "Webhook secret not configured",
    });
  }

  let event: Stripe.Event;

  // ------------------------------------------------
  // 1. Verify that the webhook really came from Stripe
  // ------------------------------------------------

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error,
    );

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature",
    });
  }

  console.log(
    "Stripe webhook received:",
    event.type,
  );

  // ------------------------------------------------
  // 2. Process the verified Stripe event
  // ------------------------------------------------

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        await handleSuccessfulPayment(
          paymentIntent,
        );

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        await handleFailedPayment(
          paymentIntent,
        );

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        await handleFailedPayment(
          paymentIntent,
        );

        break;
      }

      default: {
        console.log(
          `Unhandled Stripe event: ${event.type}`,
        );
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing failed:",
      error,
    );

    // 500 tells Stripe:
    // "processing failed, please retry this webhook"
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
}