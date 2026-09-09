#!/usr/bin/env -S node

import type { Contract as Start } from '../../snapshots/0647ab2e20faf08b4119d26a5709cb58f07609b3fa7728530c3619e22507075e/contract';

import startContract from '../../snapshots/0647ab2e20faf08b4119d26a5709cb58f07609b3fa7728530c3619e22507075e/contract.json' with { type: 'json' };

import type { Contract as End } from '../../snapshots/735d798499f1d32b645f8a589657225c6cb4d380c22be6af326e0f509ea9dec5/contract';

import endContract from '../../snapshots/735d798499f1d32b645f8a589657225c6cb4d380c22be6af326e0f509ea9dec5/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<
  Start,
  End
> {
  override readonly startContractJson =
    startContract;

  override readonly endContractJson =
    endContract;

  override get operations() {
    return [
      /*
       * 1. Every inventory row must now
       * belong to a ProductVariant.
       *
       * We already migrated the data and
       * verified variantId contains no NULLs.
       */
      this.setNotNull({
        schema: 'public',
        table: 'inventory',
        column: 'variantId',
      }),

      /*
       * 2. Remove the old Product →
       * Inventory foreign key.
       */
      this.dropConstraint({
        schema: 'public',
        table: 'inventory',
        constraint:
          'inventory_productId_fkey',
        kind: 'foreignKey',
      }),

      /*
       * 3. Remove the old unique
       * constraint on productId.
       */
      this.dropConstraint({
        schema: 'public',
        table: 'inventory',
        constraint:
          'inventory_productId_key',
      }),

      /*
       * 4. productId is no longer used
       * by Inventory.
       */
      this.dropColumn({
        schema: 'public',
        table: 'inventory',
        column: 'productId',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);