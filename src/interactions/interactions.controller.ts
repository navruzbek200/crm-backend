import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { InteractionsService } from "./interactions.service"
import { CreateInteractionDto, UpdateInteractionDto } from "./dto"
import { GetUser } from "../auth/decorators/get-user.decorator"
import { AuthGuard } from "../auth/guards/auth.guard"

@ApiTags("Interactions")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("interactions")
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new interaction" })
  create(@Body() createInteractionDto: CreateInteractionDto, @GetUser('id') userId: string) {
    return this.interactionsService.create(createInteractionDto, userId)
  }

  @Get()
  @ApiOperation({ summary: "Get all interactions with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "customerId", required: false, type: String })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('customerId') customerId?: string) {
    return this.interactionsService.findAll(
      page ? Number.parseInt(page) : 1,
      limit ? Number.parseInt(limit) : 10,
      customerId,
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interaction by ID' })
  findOne(@Param('id') id: string) {
    return this.interactionsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update interaction" })
  update(@Param('id') id: string, @Body() updateInteractionDto: UpdateInteractionDto) {
    return this.interactionsService.update(id, updateInteractionDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete interaction' })
  remove(@Param('id') id: string) {
    return this.interactionsService.remove(id);
  }
}
