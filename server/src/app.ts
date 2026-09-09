import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";

import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import categoryRoutes from "./routes/category.routes";
import addressRoutes from "./routes/address.routes";
import checkoutRoutes from "./routes/checkout.routes";

import paymentRoutes from "./routes/payment.routes";

import {
  stripeWebhook,
} from "./controllers/stripe-webhook.controller";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);


app.post(
  "/api/stripe/webhook",

  express.raw({
    type:
      "application/json",
  }),

  stripeWebhook,
);


app.use(
  express.json(),
);

app.use(
  cookieParser(),
);

app.use(
  "/api/auth",
  authRoutes,
);

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/addresses",  addressRoutes,);

app.use(  "/api/checkout",  checkoutRoutes,);

app.use(  "/api/payments",  paymentRoutes,);

export default app;