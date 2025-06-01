import { IsString, IsEmail, IsOptional, IsEnum, IsPhoneNumber } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ContactMethod } from "@prisma/client"

export class CreateCustomerDto {
  @ApiProperty({ example: "Fashion Forward Inc." })
  @IsString()
  companyName: string

  @ApiProperty({ example: "John Smith" })
  @IsString()
  contactName: string

  @ApiProperty({ example: "john@fashionforward.com" })
  @IsEmail()
  email: string

  @ApiPropertyOptional({ example: "+1-555-0123" })
  @IsOptional()
  @IsPhoneNumber("UZ")
  @IsString()
  phone?: string

  @ApiPropertyOptional({ example: "123 Main St" })
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional({ example: "New York" })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ example: "NY" })
  @IsOptional()
  @IsString()
  state?: string

  @ApiPropertyOptional({ example: "10001" })
  @IsOptional()
  @IsString()
  zipCode?: string

  @ApiPropertyOptional({ example: "USA" })
  @IsOptional()
  @IsString()
  country?: string

  @ApiPropertyOptional({ example: "https://fashionforward.com" })
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional({ example: "Important client for summer collection" })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({ enum: ContactMethod, example: ContactMethod.EMAIL })
  @IsOptional()
  @IsEnum(ContactMethod)
  preferredContactMethod?: ContactMethod
}
