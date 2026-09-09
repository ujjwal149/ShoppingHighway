import { db } from "../prisma/db";
import type { AddCartItemInput, UpdateCartItemInput, } from "../validation/cart.schema";

export const addItemToCart = async (
  customerId: number,
  input: AddCartItemInput,
) => {
  const {
    variantId,
    quantity,
  } = input;

  const customer =
    await db.orm.public.Customer
      .where({
        id: customerId,
      })
      .first();

  if (!customer) {
    throw new Error(
      "CUSTOMER_NOT_FOUND",
    );
  }

  const variant =
    await db.orm.public.ProductVariant
      .where({
        id: variantId,
      })
      .first();

  if (!variant) {
    throw new Error(
      "VARIANT_NOT_FOUND",
    );
  }

  const inventory =
    await db.orm.public.Inventory
      .where({
        variantId,
      })
      .first();

  if (!inventory) {
    throw new Error(
      "INVENTORY_NOT_FOUND",
    );
  }

  let cart =
    await db.orm.public.Cart
      .where({
        customerId,
      })
      .first();

  if (!cart) {
    cart =
      await db.orm.public.Cart.create({
        customerId,
      });
  }

  const existingItem =
    await db.orm.public.CartItem
      .where({
        cartId: cart.id,
        variantId,
      })
      .first();

  const finalQuantity =
    (existingItem?.quantity ?? 0) +
    quantity;

  if (
    finalQuantity >
    inventory.quantity
  ) {
    throw new Error(
      "INSUFFICIENT_STOCK",
    );
  }

  if (existingItem) {
    return db.orm.public.CartItem
      .where({
        id: existingItem.id,
      })
      .update({
        quantity:
          finalQuantity,
      });
  }

  return db.orm.public.CartItem.create({
    cartId: cart.id,
    variantId,
    quantity,
  });
};


export const getCartByCustomerId = async (
  customerId: number,
) => {
  // Check that the customer actually exists
  const customer = await db.orm.public.Customer
    .where({
      id: customerId,
    })
    .first();

  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  // Find the customer's cart CartItems, its CartItems, Product belonging to each CartItem 
   const cart =
    await db.orm.public.Cart
      .where({
        customerId,
      })
      .include("items", (items) =>
        items.include(
          "variant",
          (variant) =>
            variant
              .include("product")
              .include("inventory"),
        ),
      )
      .first();

  // Customer exists but has never added anything
  if (!cart) {
    return {
      id: null,
      customerId,
      items: [],
    };
  }

  return cart;
};


export const updateCartItemQuantity =
  async (
    customerId: number,
    cartItemId: number,
    input: UpdateCartItemInput,
  ) => {
    const { quantity } = input;

    const cart =
      await db.orm.public.Cart
        .where({
          customerId,
        })
        .first();

    if (!cart) {
      throw new Error(
        "CART_ITEM_NOT_FOUND",
      );
    }

    const cartItem =
      await db.orm.public.CartItem
        .where({
          id: cartItemId,
        })
        .first();


    if (
      !cartItem ||
      cartItem.cartId !== cart.id
    ) {
      throw new Error(
        "CART_ITEM_NOT_FOUND",
      );
    }

    const inventory =
      await db.orm.public.Inventory
        .where({
          variantId:
            cartItem.variantId,
        })
        .first();

    if (!inventory) {
      throw new Error(
        "INVENTORY_NOT_FOUND",
      );
    }

    if (
      quantity >
      inventory.quantity
    ) {
      throw new Error(
        "INSUFFICIENT_STOCK",
      );
    }

    return db.orm.public.CartItem
      .where({
        id: cartItemId,
      })
      .update({
        quantity,
      });
  };

export const removeCartItem = async (
  customerId: number,
  cartItemId: number,
) => {
  const cart =
    await db.orm.public.Cart
      .where({
        customerId,
      })
      .first();

  if (!cart) {
    throw new Error(
      "CART_ITEM_NOT_FOUND",
    );
  }

  const cartItem =
    await db.orm.public.CartItem
      .where({
        id: cartItemId,
      })
      .first();

  if (
    !cartItem ||
    cartItem.cartId !== cart.id
  ) {
    throw new Error(
      "CART_ITEM_NOT_FOUND",
    );
  }

  return db.orm.public.CartItem
    .where({
      id: cartItemId,
    })
    .delete();
};