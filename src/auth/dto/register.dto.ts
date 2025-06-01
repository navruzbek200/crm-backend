import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

export class RegisterDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: "password123", minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({ enum: UserRole, example: UserRole.SALES_TEAM })
  @IsEnum(UserRole)
  role: UserRole
}
