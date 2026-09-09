#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/f7e4c04bf1e96764e9009e4c5ebed04135f89ff0d317e645ba3e29195422bc9d/contract';
import startContract from '../../snapshots/f7e4c04bf1e96764e9009e4c5ebed04135f89ff0d317e645ba3e29195422bc9d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fe6f877606987e83453f45b41c2a609383e90b379b8c7eb6510db52e3a78e59d/contract';
import endContract from '../../snapshots/fe6f877606987e83453f45b41c2a609383e90b379b8c7eb6510db52e3a78e59d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'orderItem',
        column: col('variantId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'orderItem',
        index: 'orderItem_variantId_idx_e16bb45d',
        columns: ['variantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'orderItem',
        foreignKey: {
          name: 'orderItem_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'productVariant', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
