#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/735d798499f1d32b645f8a589657225c6cb4d380c22be6af326e0f509ea9dec5/contract';
import startContract from '../../snapshots/735d798499f1d32b645f8a589657225c6cb4d380c22be6af326e0f509ea9dec5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d4c1194c58751a5f57bb1b9e08c502a7b2483308338570517897158434c58c43/contract';
import endContract from '../../snapshots/d4c1194c58751a5f57bb1b9e08c502a7b2483308338570517897158434c58c43/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'cartItem',
        column: col('variantId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'cartItem',
        index: 'cartItem_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'cartItem',
        foreignKey: {
          name: 'cartItem_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'productVariant', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
