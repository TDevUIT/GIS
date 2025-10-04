import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Success',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Error details',
    example: {
      code: 'ERROR_CODE',
      details: 'Error details',
    },
  })
  error?: {
    code?: string;
    details?: any;
  };

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-10-04T12:18:18.000Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Request path',
    example: '/api/v1/districts',
  })
  path?: string;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
    this.timestamp = this.timestamp || new Date().toISOString();
  }

  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      statusCode,
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    message: string,
    statusCode = 500,
    error?: { code?: string; details?: any },
  ): ApiResponse<null> {
    return new ApiResponse<null>({
      statusCode,
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
