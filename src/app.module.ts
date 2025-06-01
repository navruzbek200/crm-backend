import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { CustomersModule } from "./customers/customers.module"
import { InteractionsModule } from "./interactions/interactions.module"
import { DealsModule } from "./deals/deals.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    InteractionsModule,
    DealsModule,
  ],
})
export class AppModule {}
