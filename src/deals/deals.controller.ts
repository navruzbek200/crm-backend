import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { DealsService } from "./deals.service"
import { CreateDealDto, UpdateDealDto } from "./dto"
import { GetUser } from "../auth/decorators/get-user.decorator"
import { DealStatus } from "@prisma/client"
import { AuthGuard } from "../auth/guards/auth.guard"

@ApiTags("Deals")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("deals")
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new deal" })
  create(@Body() createDealDto: CreateDealDto, @GetUser('id') userId: string) {
    return this.dealsService.create(createDealDto, userId)
  }

  @Get()
  @ApiOperation({ summary: "Get all deals with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "status", required: false, enum: DealStatus })
  @ApiQuery({ name: "customerId", required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: DealStatus,
    @Query('customerId') customerId?: string,
  ) {
    return this.dealsService.findAll(
      page ? Number.parseInt(page) : 1,
      limit ? Number.parseInt(limit) : 10,
      status,
      customerId,
    )
  }

  @Get("statistics")
  @ApiOperation({ summary: "Get deal statistics" })
  getStatistics() {
    return this.dealsService.getStatistics()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by ID' })
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update deal" })
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto) {
    return this.dealsService.update(id, updateDealDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal' })
  remove(@Param('id') id: string) {
    return this.dealsService.remove(id);
  }
}
