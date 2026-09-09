#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/99db225cffaef147c068be0d1e1aa1b50252fa415c7591396f632cf679591675/contract';
import endContract from '../../snapshots/99db225cffaef147c068be0d1e1aa1b50252fa415c7591396f632cf679591675/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/fe6f877606987e83453f45b41c2a609383e90b379b8c7eb6510db52e3a78e59d/contract';
import startContract from '../../snapshots/fe6f877606987e83453f45b41c2a609383e90b379b8c7eb6510db52e3a78e59d/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
} from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'orderItem',
        constraint: 'orderItem_productId_fkey',
        kind: 'foreignKey',
      }),
      this.dropIndex({
        schema: 'public',
        table: 'orderItem',
        index: 'orderItem_productId_idx_5858600a',
      }),
      this.dropColumn({ schema: 'public', table: 'orderItem', column: 'productId' }),
      this.setNotNull({ schema: 'public', table: 'orderItem', column: 'variantId' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
