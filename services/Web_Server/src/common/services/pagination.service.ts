import { Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { PaginationQueryDto } from '../dto/pagination.dto';

@Injectable()
export class PaginationService {
  createPaginatedResponse<T>(
    items: T[],
    total: number,
    query: PaginationQueryDto,
  ): PaginatedResponseDto<T> {
    return PaginatedResponseDto.create(items, total, query.page!, query.limit!);
  }

  calculatePaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);

    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  getPaginationParams(query: PaginationQueryDto): {
    skip: number;
    take: number;
  } {
    return {
      skip: query.getSkip(),
      take: query.getTake(),
    };
  }

  buildOrderObject(sortBy?: string, sortOrder?: string): Record<string, any> {
    if (!sortBy) {
      return {};
    }

    return {
      [sortBy]: sortOrder || 'desc',
    };
  }
}
