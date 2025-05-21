import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './book/entities/book.entity';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        models: [Book],
        autoLoadModels: true,
        synchronize: true,
        logging: true,
      }),
    }),
    BookModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
