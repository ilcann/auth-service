import {
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserStatus } from '@prisma/client';

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value as string[];
    return [value as string]; // Convert single value to array
  })
  departmentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  statuses?: UserStatus[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}
