import { Injectable, NotFoundException } from "@nestjs/common"
import  { PrismaService } from "../prisma/prisma.service"
import  { CreateCustomerDto, UpdateCustomerDto } from "./dto"

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: dto,
    })
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [
            { companyName: { contains: search, mode: "insensitive" as const } },
            { contactName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.customer.count({ where }),
    ])

    return {
      data: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        interactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!customer) {
      throw new NotFoundException("Customer not found")
    }

    return customer
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } })

    if (!customer) {
      throw new NotFoundException("Customer not found")
    }

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    })
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } })

    if (!customer) {
      throw new NotFoundException("Customer not found")
    }

    return this.prisma.customer.delete({
      where: { id },
    })
  }
}
