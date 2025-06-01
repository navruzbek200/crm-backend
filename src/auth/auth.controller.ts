import { Body, Controller, Post, Session, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { LoginDto, RegisterDto } from "./dto"
import { AuthGuard } from "./guards/auth.guard"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  async register(@Body() dto: RegisterDto, @Session() session: any) {
    const result = await this.authService.register(dto)
    session.user = result.user
    return result
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  async login(@Body() dto: LoginDto, @Session() session: any) {
    const result = await this.authService.login(dto)
    session.user = result.user
    return result
  }

  @Post("logout")
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "User successfully logged out" })
  @UseGuards(AuthGuard)
  logout(@Session() session: any) {
    session.destroy()
    return { message: "Logged out successfully" }
  }

  @Get("me")
  @ApiOperation({ summary: "Get current user" })
  @UseGuards(AuthGuard)
  me(@Session() session: any) {
    return { user: session.user }
  }
}
