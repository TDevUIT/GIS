import { PaginationMeta } from './api-response.dto';

export class PaginatedResponseDto<T> {
  items: T[];
  meta: PaginationMeta;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.meta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }
}
