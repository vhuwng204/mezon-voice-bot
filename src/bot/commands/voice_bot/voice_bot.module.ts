import { Module } from '@nestjs/common';
import { VoiceBotService } from './voice_bot.service';
import { UserVoice } from 'src/bot/models/user_voice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceBotCommand } from './voice_bot.command';
@Module({
  imports: [TypeOrmModule.forFeature([UserVoice])],
  providers: [VoiceBotService, VoiceBotCommand],
  exports: [VoiceBotService, VoiceBotCommand],
})
export class VoiceBotModule { }
