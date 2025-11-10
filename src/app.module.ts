import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MezonModule } from './mezon/mezon.module';
import { BotModule } from './bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { VoiceBotModule } from './bot/commands/voice_bot/voice_bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.{ts,js}')],
        synchronize: configService.get<boolean>('ENABLE_SYNCHRONIZE', false),
      }),
    }),
    EventEmitterModule.forRoot(),
    MezonModule.forRootAsync({
      imports: [ConfigModule],
    }),
    BotModule,
    VoiceBotModule
  ],
})
export class AppModule { }
