import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ChannelMessageEventHandler } from './handlers/channelMessage.handler';
import { BotGateway } from './events/bot.gateway';
import { VoiceBotModule } from './commands/voice_bot/voice_bot.module';

@Module({
  imports: [DiscoveryModule, VoiceBotModule],
  providers: [
    BotGateway,
    ChannelMessageEventHandler
  ],
  controllers: [],
})
export class BotModule {}
