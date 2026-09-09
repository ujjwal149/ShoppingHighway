#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0647ab2e20faf08b4119d26a5709cb58f07609b3fa7728530c3619e22507075e/contract';
import endContract from '../../snapshots/0647ab2e20faf08b4119d26a5709cb58f07609b3fa7728530c3619e22507075e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/67aab69ea4b2f7dd7148703d679c53d1f812c09e34a0b3b8a012cf851e391c07/contract';
import startContract from '../../snapshots/67aab69ea4b2f7dd7148703d679c53d1f812c09e34a0b3b8a012cf851e391c07/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'inventory',
        column: col('variantId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dropNotNull({ schema: 'public', table: 'inventory', column: 'productId' }),
      this.addUnique({
        schema: 'public',
        table: 'inventory',
        constraint: 'inventory_variantId_key',
        columns: ['variantId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'inventory',
        foreignKey: {
          name: 'inventory_variantId_fkey',
          columns: ['variantId'],
          references: { schema: 'public', table: 'productVariant', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
