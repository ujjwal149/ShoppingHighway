#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/67aab69ea4b2f7dd7148703d679c53d1f812c09e34a0b3b8a012cf851e391c07/contract';
import endContract from '../../snapshots/67aab69ea4b2f7dd7148703d679c53d1f812c09e34a0b3b8a012cf851e391c07/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/aab4870f6d6101ee6e51520d392b5e2f22659fdeb37c95ef4219de630372d581/contract';
import startContract from '../../snapshots/aab4870f6d6101ee6e51520d392b5e2f22659fdeb37c95ef4219de630372d581/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'productVariant',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('productId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('size', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'productVariant',
        constraint: 'productVariant_sku_key',
        columns: ['sku'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'productVariant',
        constraint: 'productVariant_productId_size_key',
        columns: ['productId', 'size'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'productVariant',
        index: 'productVariant_productId_idx_5858600a',
        columns: ['productId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'productVariant',
        foreignKey: {
          name: 'productVariant_productId_fkey',
          columns: ['productId'],
          references: { schema: 'public', table: 'product', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
