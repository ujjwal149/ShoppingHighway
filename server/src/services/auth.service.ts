import bcrypt from "bcryptjs";

import {
  db,
} from "../prisma/db";

import type {
  LoginInput,
  SignupInput,
} from "../validation/auth.schema";


export const signupCustomer = async (
  input: SignupInput,
) => {
  const {
    name,
    email,
    password,
  } = input;

  /*
   * 1. Check whether this email
   * already belongs to a customer.
   */
  const existingCustomer =
    await db.orm.public.Customer
      .where({
        email,
      })
      .first();

  if (existingCustomer) {
    throw new Error(
      "EMAIL_ALREADY_EXISTS",
    );
  }

  /*
   * 2. Hash the plain password.
   *
   * Never store:
   * password = "hello123"
   */
  const passwordHash =
    await bcrypt.hash(
      password,
      12,
    );

  /*
   * 3. Create customer.
   */
  const customer =
    await db.orm.public.Customer.create({
      name,
      email,
      passwordHash,
    });

  /*
   * 4. Return only safe data.
   *
   * Do not return passwordHash.
   */
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    createdAt:
      customer.createdAt,
  };
};


//Login customer
export const loginCustomer = async (
  input: LoginInput,
) => {
  const {
    email,
    password,
  } = input;

  const customer =
    await db.orm.public.Customer
      .where({
        email,
      })
      .first();

  if (!customer) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      customer.passwordHash,
    );

  if (!passwordMatches) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    createdAt:
      customer.createdAt,
  };
};


//me
export const getCustomerById =
  async (
    customerId: number,
  ) => {
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

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt:
        customer.createdAt,
    };
  };