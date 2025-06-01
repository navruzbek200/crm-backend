import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateInteractionDto, UpdateInteractionDto } from "./dto"

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInteractionDto, userId: string) {
    return this.prisma.interaction.create({
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

  async findAll(page = 1, limit = 10, customerId?: string) {
    const skip = (page - 1) * limit

    const where = customerId ? { customerId } : {}

    const [interactions, total] = await Promise.all([
      this.prisma.interaction.findMany({
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
      this.prisma.interaction.count({ where }),
    ])

    return {
      data: interactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const interaction = await this.prisma.interaction.findUnique({
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

    if (!interaction) {
      throw new NotFoundException("Interaction not found")
    }

    return interaction
  }

  async update(id: string, dto: UpdateInteractionDto) {
    const interaction = await this.prisma.interaction.findUnique({ where: { id } })

    if (!interaction) {
      throw new NotFoundException("Interaction not found")
    }

    return this.prisma.interaction.update({
      where: { id },
      data: dto,
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
    const interaction = await this.prisma.interaction.findUnique({ where: { id } })

    if (!interaction) {
      throw new NotFoundException("Interaction not found")
    }

    return this.prisma.interaction.delete({
      where: { id },
    })
  }
}
