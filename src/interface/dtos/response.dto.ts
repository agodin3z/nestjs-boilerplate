import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ResponseDto<T = any> {
  @ApiProperty({ description: 'Status of the response' })
  @Expose()
  success: boolean;

  @ApiProperty({ description: 'Result of the response', required: false })
  @Expose()
  result?: T;

  @ApiProperty({ description: 'Short message' })
  @Expose()
  message: string;
}

export class InnerResponseDto<T = any> {
  @ApiProperty({ description: 'Status Code' })
  @Expose()
  status: number;

  @ApiProperty({ description: 'Response' })
  @Expose()
  @Type(() => ResponseDto<T>)
  result: ResponseDto<T>;
}
