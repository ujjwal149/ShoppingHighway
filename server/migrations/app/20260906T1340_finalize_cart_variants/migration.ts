#!/usr/bin/env -S node

import type { Contract as Start } from '../../snapshots/d4c1194c58751a5f57bb1b9e08c502a7b2483308338570517897158434c58c43/contract';

import startContract from '../../snapshots/d4c1194c58751a5f57bb1b9e08c502a7b2483308338570517897158434c58c43/contract.json' with { type: 'json' };

import type { Contract as End } from '../../snapshots/f7e4c04bf1e96764e9009e4c5ebed04135f89ff0d317e645ba3e29195422bc9d/contract';

import endContract from '../../snapshots/f7e4c04bf1e96764e9009e4c5ebed04135f89ff0d317e645ba3e29195422bc9d/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;

  override readonly endContractJson = endContract;

  override get operations() {
    return [
      /*
       * We already backfilled every existing CartItem,
       * so variantId can safely become required.
       */
      this.setNotNull({
        schema: 'public',
        table: 'cartItem',
        column: 'variantId',
      }),

      /*
       * A cart may only contain one row
       * for a particular variant.
       */
      this.addUnique({
        schema: 'public',
        table: 'cartItem',
        constraint: 'cartItem_cartId_variantId_key',
        columns: ['cartId', 'variantId'],
      }),

      /*
       * Remove the old Product-based cart relation.
       */
      this.dropConstraint({
        schema: 'public',
        table: 'cartItem',
        constraint: 'cartItem_productId_fkey',
        kind: 'foreignKey',
      }),

      this.dropIndex({
        schema: 'public',
        table: 'cartItem',
        index: 'cartItem_productId_idx_5858600a',
      }),

      this.dropConstraint({
        schema: 'public',
        table: 'cartItem',
        constraint: 'cartItem_cartId_productId_key',
      }),

      this.dropColumn({
        schema: 'public',
        table: 'cartItem',
        column: 'productId',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);