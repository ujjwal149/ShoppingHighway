import { db } from "../prisma/db";

import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "../validation/address.schema";


const unsetDefaultAddresses =
  async (
    customerId: number,
  ) => {
    const defaultAddresses =
      await db.orm.public.CustomerAddress
        .where({
          customerId,
          isDefault: true,
        })
        .all();

    for (
      const address
      of defaultAddresses
    ) {
      await db.orm.public.CustomerAddress
        .where({
          id: address.id,
        })
        .update({
          isDefault: false,
        });
    }
  };


export const getCustomerAddresses =
  async (
    customerId: number,
  ) => {
    const addresses =
      await db.orm.public.CustomerAddress
        .where({
          customerId,
        })
        .all();

    return addresses;
  };


export const createCustomerAddress =
  async (
    customerId: number,
    input: CreateAddressInput,
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

    const existingAddresses =
      await db.orm.public.CustomerAddress
        .where({
          customerId,
        })
        .all();

    /*
     * First saved address automatically
     * becomes the default address.
     */
    const shouldBeDefault =
      existingAddresses.length === 0
        ? true
        : input.isDefault;

    if (shouldBeDefault) {
      await unsetDefaultAddresses(
        customerId,
      );
    }

    const customLabel =
      input.label === "OTHER"
        ? input.customLabel ??
          null
        : null;

    const address =
      await db.orm.public.CustomerAddress.create({
        label:
          input.label,

        customLabel,

        fullName:
          input.fullName,

        phone:
          input.phone,

        addressLine1:
          input.addressLine1,

        addressLine2:
          input.addressLine2 ??
          null,

        city:
          input.city,

        state:
          input.state,

        postalCode:
          input.postalCode,

        country:
          input.country,

        isDefault:
          shouldBeDefault,

        customerId,
      });

    return address;
  };


export const updateCustomerAddress =
  async (
    customerId: number,
    addressId: number,
    input: UpdateAddressInput,
  ) => {
    const existingAddress =
      await db.orm.public.CustomerAddress
        .where({
          id: addressId,
          customerId,
        })
        .first();

    /*
     * Same response whether it doesn't
     * exist or belongs to somebody else.
     *
     * Prevents leaking another customer's
     * address existence.
     */
    if (!existingAddress) {
      throw new Error(
        "ADDRESS_NOT_FOUND",
      );
    }

    const finalLabel =
      input.label ??
      existingAddress.label;

    const finalCustomLabel =
      input.customLabel !==
      undefined
        ? input.customLabel
        : existingAddress.customLabel;

    if (
      finalLabel === "OTHER" &&
      !finalCustomLabel
    ) {
      throw new Error(
        "CUSTOM_LABEL_REQUIRED",
      );
    }

    /*
     * Setting this address as default
     * automatically unsets the old one.
     */
    if (
      input.isDefault === true
    ) {
      await unsetDefaultAddresses(
        customerId,
      );
    }

    /*
     * Don't allow the current default
     * address to simply become non-default.
     *
     * Instead, the customer should mark
     * another address as default.
     */
    if (
      existingAddress.isDefault &&
      input.isDefault === false
    ) {
      throw new Error(
        "CANNOT_UNSET_DEFAULT_ADDRESS",
      );
    }

    const updateData = {
      ...input,

      /*
       * A HOME/OFFICE address should
       * never retain an old custom label.
       */
      customLabel:
        finalLabel === "OTHER"
          ? finalCustomLabel
          : null,
    };

    const updatedAddress =
      await db.orm.public.CustomerAddress
        .where({
          id: addressId,
        })
        .update(
          updateData,
        );

    return updatedAddress;
  };


export const deleteCustomerAddress =
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

    const wasDefault =
      address.isDefault;

    const deletedAddress =
      await db.orm.public.CustomerAddress
        .where({
          id: addressId,
        })
        .delete();

    /*
     * If the default address was deleted,
     * automatically choose another saved
     * address as the new default.
     */
    if (wasDefault) {
      const remainingAddresses =
        await db.orm.public.CustomerAddress
          .where({
            customerId,
          })
          .all();

      const nextAddress =
        remainingAddresses[0];

      if (nextAddress) {
        await db.orm.public.CustomerAddress
          .where({
            id:
              nextAddress.id,
          })
          .update({
            isDefault: true,
          });
      }
    }

    return deletedAddress;
  };