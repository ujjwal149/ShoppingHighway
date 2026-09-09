import type {
  Request,
  Response,
} from "express";

import {
  addressParamsSchema,
  createAddressSchema,
  updateAddressSchema,
} from "../validation/address.schema";

import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  updateCustomerAddress,
} from "../services/address.service";


export const getAddresses =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!
          .customerId;

      const addresses =
        await getCustomerAddresses(
          customerId,
        );

      return res
        .status(200)
        .json({
          success: true,
          data: addresses,
        });
    } catch (error) {
      console.error(
        "Failed to fetch addresses:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to fetch addresses",
        });
    }
  };


export const createAddress =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!
          .customerId;

      const parsedBody =
        createAddressSchema.safeParse(
          req.body,
        );

      if (
        !parsedBody.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid address data",

            errors:
              parsedBody.error.flatten(),
          });
      }

      const address =
        await createCustomerAddress(
          customerId,
          parsedBody.data,
        );

      return res
        .status(201)
        .json({
          success: true,
          message:
            "Address added successfully",
          data: address,
        });
    } catch (error) {
      if (
        error instanceof
          Error &&
        error.message ===
          "CUSTOMER_NOT_FOUND"
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Customer not found",
          });
      }

      console.error(
        "Failed to create address:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to create address",
        });
    }
  };


export const updateAddress =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!
          .customerId;

      const parsedParams =
        addressParamsSchema.safeParse(
          req.params,
        );

      if (
        !parsedParams.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid address ID",
          });
      }

      const parsedBody =
        updateAddressSchema.safeParse(
          req.body,
        );

      if (
        !parsedBody.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid address data",

            errors:
              parsedBody.error.flatten(),
          });
      }

      const address =
        await updateCustomerAddress(
          customerId,
          parsedParams.data
            .addressId,
          parsedBody.data,
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Address updated successfully",
          data: address,
        });
    } catch (error) {
      if (
        error instanceof
          Error &&
        error.message ===
          "ADDRESS_NOT_FOUND"
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Address not found",
          });
      }

      if (
        error instanceof
          Error &&
        error.message ===
          "CUSTOM_LABEL_REQUIRED"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Custom label is required for OTHER addresses",
          });
      }

      if (
        error instanceof
          Error &&
        error.message ===
          "CANNOT_UNSET_DEFAULT_ADDRESS"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Set another address as default instead",
          });
      }

      console.error(
        "Failed to update address:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to update address",
        });
    }
  };


export const deleteAddress =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!
          .customerId;

      const parsedParams =
        addressParamsSchema.safeParse(
          req.params,
        );

      if (
        !parsedParams.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid address ID",
          });
      }

      const deletedAddress =
        await deleteCustomerAddress(
          customerId,
          parsedParams.data
            .addressId,
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Address deleted successfully",
          data:
            deletedAddress,
        });
    } catch (error) {
      if (
        error instanceof
          Error &&
        error.message ===
          "ADDRESS_NOT_FOUND"
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Address not found",
          });
      }

      console.error(
        "Failed to delete address:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to delete address",
        });
    }
  };