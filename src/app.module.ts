import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/book.entity';
import { User } from './user/user.entity';
import { BooksModule } from './books/books.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeederService } from './seeder/seeder.service';
import { BorrowModule } from './borrow/borrow.module';
import { Borrow } from './borrow/entities/borrow.entity';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Book, User, Borrow],
        synchronize: true,
      }),
    }),
    BooksModule,
    UserModule,
    BorrowModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService, SeederService],
})
export class AppModule {}
