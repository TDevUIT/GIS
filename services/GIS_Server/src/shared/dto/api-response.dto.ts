import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ description: 'HTTP status code', example: 200 })
  statusCode: number;

  @ApiProperty({ description: 'Whether the request was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response message', example: 'Success' })
  message: string;

  @ApiPropertyOptional({ description: 'Response data' })
  data?: T;

  @ApiPropertyOptional({ description: 'Error details if any' })
  error?: any;

  @ApiProperty({ description: 'Timestamp of the response', example: '2025-10-05T00:18:50.000Z' })
  timestamp: string;

  @ApiPropertyOptional({ description: 'Request path', example: '/api/v1/accidents' })
  path?: string;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
  }
}

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page', example: false })
  hasPreviousPage: boolean;
}

export class PaginatedResponse<T> {
  @ApiProperty({ description: 'Array of items', type: 'array' })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;
}
