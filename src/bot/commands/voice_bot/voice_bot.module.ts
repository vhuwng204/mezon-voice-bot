import { Module } from '@nestjs/common';
import { VoiceBotService } from './voice_bot.service';
import { VoiceBotController } from './voice_bot.controller';

@Module({
  controllers: [VoiceBotController],
  providers: [VoiceBotService],
})
export class VoiceBotModule {}
