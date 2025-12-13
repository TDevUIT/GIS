import { ApiProperty } from '@nestjs/swagger';

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 100,
      totalPages: 10,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta: PaginationMeta;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    const totalPages = Math.ceil(total / limit);

    this.meta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static create<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto<T>(items, total, page, limit);
  }
}
