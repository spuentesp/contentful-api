import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ContentfulService } from './contentful/contentful.service';
import { ContentfulCronService } from './contentful-cron/contentful-cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentfulController } from './contentful/contentful.controller';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
     ScheduleModule.forRoot(),
     ReportsModule
  ],
  controllers: [AppController, ContentfulController],
  providers: [AppService, ContentfulService, ContentfulCronService],
})
export class AppModule {}
