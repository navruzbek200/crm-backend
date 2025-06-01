import { Injectable, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"
import  { CreateDealDto, UpdateDealDto } from "./dto"
import { DealStatus } from "@prisma/client"

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDealDto, userId: string) {
    // console.log(dto, userId)
    return this.prisma.deal.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
  }

  async findAll(page = 1, limit = 10, status?: DealStatus, customerId?: string) {
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (customerId) where.customerId = customerId

    const [deals, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.deal.count({ where }),
    ])

    return {
      data: deals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!deal) {
      throw new NotFoundException("Deal not found")
    }

    return deal
  }

  async update(id: string, dto: UpdateDealDto) {
    const deal = await this.prisma.deal.findUnique({ where: { id } })

    if (!deal) {
      throw new NotFoundException("Deal not found")
    }

    // Set actualCloseDate when deal is won or lost
    const updateData: any = { ...dto }
    if (dto.status && dto.status !== DealStatus.OPEN && !deal.actualCloseDate) {
      updateData.actualCloseDate = new Date()
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id } })

    if (!deal) {
      throw new NotFoundException("Deal not found")
    }

    return this.prisma.deal.delete({
      where: { id },
    })
  }

  async getStatistics() {
    const [totalDeals, openDeals, wonDeals, lostDeals, totalValue] = await Promise.all([
      this.prisma.deal.count(),
      this.prisma.deal.count({ where: { status: DealStatus.OPEN } }),
      this.prisma.deal.count({ where: { status: DealStatus.WON } }),
      this.prisma.deal.count({ where: { status: DealStatus.LOST } }),
      this.prisma.deal.aggregate({
        _sum: { value: true },
        where: { status: DealStatus.WON },
      }),
    ])

    return {
      totalDeals,
      openDeals,
      wonDeals,
      lostDeals,
      totalValue: totalValue._sum.value || 0,
      winRate: totalDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0,
    }
  }
}
