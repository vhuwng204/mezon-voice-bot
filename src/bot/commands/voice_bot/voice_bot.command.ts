import { Injectable } from '@nestjs/common';
import { VoiceBotService } from './voice_bot.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelMessage, Events } from 'mezon-sdk';

@Injectable()
export class VoiceBotCommand {
  constructor(private readonly voiceBotService: VoiceBotService) { }

  @OnEvent(Events.ChannelMessage)
  async handleChannelMessage(message: ChannelMessage) {
    if (message.content.t?.startsWith('*register_voice')) {
      await this.voiceBotService.handleRegisterVoice(message);
    }
    else if (message.content.t?.startsWith('*clone_voice')) {
      await this.voiceBotService.handleCloneVoice(message);
    }
    else if (message.content.t?.startsWith('*list_voice')) {
      await this.voiceBotService.handleGetListVoice(message);
    }
    // else if (message.content.t?.startsWith('*play_audio'))
    //   await this.voiceBotService.handleVoiceBot(message);
    else if (message.content.t?.startsWith('*bot_help')) {
      await this.voiceBotService.handleShowHelpMessage(message);
    }
  }
}
