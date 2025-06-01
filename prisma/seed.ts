import { PrismaClient, UserRole, ContactMethod, InteractionType, DealStatus, Priority } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@crm.com" },
    update: {},
    create: {
      email: "admin@crm.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    },
  })

  // Create sales team users
  const salesPassword = await bcrypt.hash("sales123", 12)
  const salesUser1 = await prisma.user.upsert({
    where: { email: "john@crm.com" },
    update: {},
    create: {
      email: "john@crm.com",
      password: salesPassword,
      firstName: "John",
      lastName: "Smith",
      role: UserRole.SALES_TEAM,
    },
  })

  const salesUser2 = await prisma.user.upsert({
    where: { email: "sarah@crm.com" },
    update: {},
    create: {
      email: "sarah@crm.com",
      password: salesPassword,
      firstName: "Sarah",
      lastName: "Johnson",
      role: UserRole.SALES_TEAM,
    },
  })

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      companyName: "Fashion Forward Inc.",
      contactName: "Michael Brown",
      email: "michael@fashionforward.com",
      phone: "+1-555-0123",
      address: "123 Fashion Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      website: "https://fashionforward.com",
      notes: "Premium client, high volume orders",
      preferredContactMethod: ContactMethod.EMAIL,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      companyName: "Style Boutique",
      contactName: "Emma Wilson",
      email: "emma@styleboutique.com",
      phone: "+1-555-0456",
      address: "456 Style Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
      preferredContactMethod: ContactMethod.PHONE,
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      companyName: "Urban Threads",
      contactName: "David Lee",
      email: "david@urbanthreads.com",
      phone: "+1-555-0789",
      address: "789 Urban Blvd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      preferredContactMethod: ContactMethod.EMAIL,
    },
  })

  // Create interactions
  await prisma.interaction.create({
    data: {
      type: InteractionType.MEETING,
      subject: "Quarterly Business Review",
      description: "Discussed upcoming spring collection and order volumes",
      notes: "Client interested in expanding their order by 30%",
      scheduledAt: new Date("2024-01-15T10:00:00Z"),
      completedAt: new Date("2024-01-15T11:30:00Z"),
      customerId: customer1.id,
      userId: salesUser1.id,
    },
  })

  await prisma.interaction.create({
    data: {
      type: InteractionType.CALL,
      subject: "Follow-up on Summer Collection",
      description: "Called to discuss summer collection preferences",
      notes: "Prefers lighter fabrics and brighter colors",
      scheduledAt: new Date("2024-01-20T14:00:00Z"),
      completedAt: new Date("2024-01-20T14:30:00Z"),
      customerId: customer2.id,
      userId: salesUser2.id,
    },
  })

  await prisma.interaction.create({
    data: {
      type: InteractionType.EMAIL,
      subject: "New Product Catalog",
      description: "Sent latest product catalog and pricing information",
      notes: "Awaiting feedback on new designs",
      completedAt: new Date("2024-01-22T09:00:00Z"),
      customerId: customer3.id,
      userId: salesUser1.id,
    },
  })

  // Create deals
  await prisma.deal.create({
    data: {
      title: "Spring Collection Order",
      description: "Large order for spring fashion collection",
      value: 25000.0,
      status: DealStatus.OPEN,
      priority: Priority.HIGH,
      expectedCloseDate: new Date("2024-03-15T00:00:00Z"),
      customerId: customer1.id,
      userId: salesUser1.id,
    },
  })

  await prisma.deal.create({
    data: {
      title: "Summer Casual Wear",
      description: "Summer casual wear collection for boutique",
      value: 15000.0,
      status: DealStatus.WON,
      priority: Priority.MEDIUM,
      expectedCloseDate: new Date("2024-02-01T00:00:00Z"),
      actualCloseDate: new Date("2024-01-28T00:00:00Z"),
      customerId: customer2.id,
      userId: salesUser2.id,
    },
  })

  await prisma.deal.create({
    data: {
      title: "Urban Streetwear Line",
      description: "Urban streetwear collection for young demographics",
      value: 18000.0,
      status: DealStatus.OPEN,
      priority: Priority.MEDIUM,
      expectedCloseDate: new Date("2024-04-01T00:00:00Z"),
      customerId: customer3.id,
      userId: salesUser1.id,
    },
  })

  await prisma.deal.create({
    data: {
      title: "Winter Accessories",
      description: "Winter accessories and outerwear",
      value: 8000.0,
      status: DealStatus.LOST,
      priority: Priority.LOW,
      expectedCloseDate: new Date("2024-01-15T00:00:00Z"),
      actualCloseDate: new Date("2024-01-20T00:00:00Z"),
      customerId: customer2.id,
      userId: salesUser2.id,
    },
  })

  console.log("✅ Database seeding completed!")
  console.log("\n📋 Seeded data:")
  console.log(`👥 Users: ${await prisma.user.count()}`)
  console.log(`🏢 Customers: ${await prisma.customer.count()}`)
  console.log(`💬 Interactions: ${await prisma.interaction.count()}`)
  console.log(`💼 Deals: ${await prisma.deal.count()}`)

  console.log("\n🔐 Login credentials:")
  console.log("Admin: admin@crm.com / admin123")
  console.log("Sales: john@crm.com / sales123")
  console.log("Sales: sarah@crm.com / sales123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
