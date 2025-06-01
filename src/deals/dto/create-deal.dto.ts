import { IsString, IsOptional, IsEnum, IsDateString, IsDecimal, IsNumber } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { DealStatus, Priority } from "@prisma/client"
import { Transform } from "class-transformer"

export class  CreateDealDto {
  @ApiProperty({ example: "Spring Collection Order" })
  @IsString()
  title: string

  @ApiPropertyOptional({ example: "Large order for spring fashion collection" })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: "25000.00" })
  @Transform(({ value }) => Number.parseFloat(value))
  // @IsDecimal({ decimal_digits: "0,2" })
  @IsNumber()
  value: number

  @ApiPropertyOptional({ enum: DealStatus, example: DealStatus.OPEN })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus

  @ApiPropertyOptional({ enum: Priority, example: Priority.HIGH })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiPropertyOptional({ example: "2024-03-15T00:00:00Z" })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string

  @ApiProperty({ example: "cuid-customer-id" })
  @IsString()
  customerId: string
}
