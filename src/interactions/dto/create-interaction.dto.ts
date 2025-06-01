import { IsString, IsOptional, IsEnum, IsDateString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { InteractionType } from "@prisma/client"

export class CreateInteractionDto {
  @ApiProperty({ enum: InteractionType, example: InteractionType.MEETING })
  @IsEnum(InteractionType)
  type: InteractionType

  @ApiProperty({ example: "Quarterly Business Review" })
  @IsString()
  subject: string

  @ApiPropertyOptional({ example: "Discussed upcoming spring collection requirements" })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: "Client interested in expanding order volume" })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({ example: "2024-02-15T10:00:00Z" })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string

  @ApiPropertyOptional({ example: "2024-02-15T11:30:00Z" })
  @IsOptional()
  @IsDateString()
  completedAt?: string

  @ApiProperty({ example: "cuid-customer-id" })
  @IsString()
  customerId: string
}
