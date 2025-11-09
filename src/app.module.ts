import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma/prisma.module';
import { appConfig } from './config/app.config';
import { swaggerConfig } from './config/swagger.config';
import { AppController } from './app.controller';
import { DepartmentsModule } from './modules/departments/departments.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, appConfig, swaggerConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    DepartmentsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
