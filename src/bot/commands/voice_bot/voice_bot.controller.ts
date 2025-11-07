import { Controller } from '@nestjs/common';
import { VoiceBotService } from './voice_bot.service';

@Controller('voice-bot')
export class VoiceBotController {
  constructor(private readonly voiceBotService: VoiceBotService) {}
}
