import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';

export type RawRow = Record<string, unknown>;
export type RowMapper<TRow extends RawRow, TResult> = (row: TRow) => TResult;

export abstract class BaseRepository {
  constructor(protected readonly prisma: PrismaService) {}

  protected async queryMany<TRow extends RawRow, TResult = TRow>(
    query: Prisma.Sql,
    mapper?: RowMapper<TRow, TResult>,
  ): Promise<TResult[]> {
    const rows = (await this.prisma.$queryRaw(query)) as TRow[];
    return mapper ? rows.map(mapper) : (rows as unknown as TResult[]);
  }

  protected async queryOne<TRow extends RawRow, TResult = TRow>(
    query: Prisma.Sql,
    mapper?: RowMapper<TRow, TResult>,
  ): Promise<TResult | undefined> {
    const rows = (await this.prisma.$queryRaw(query)) as TRow[];
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return mapper ? mapper(row) : (row as unknown as TResult);
  }
}
