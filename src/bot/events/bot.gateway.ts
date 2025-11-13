import { Injectable, Logger } from '@nestjs/common';
import {
  ApiMessageReaction,
  MezonClient,
  Events,
  TokenSentEvent,
  UserChannelRemoved,
  UserChannelAddedEvent,
} from 'mezon-sdk';
import { MezonClientService } from 'src/mezon/client.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BOT_ID } from '../constants/config';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);
  private client: MezonClient;

  constructor(
    private clientService: MezonClientService,
    private eventEmitter: EventEmitter2,
  ) {
    this.client = clientService.getClient();
  }

  initEvent() {
    this.client.onTokenSend((data: TokenSentEvent) => {
      this.eventEmitter.emit(Events.TokenSend, data);
    });

    this.client.onMessageButtonClicked((data) => {
      this.eventEmitter.emit(Events.MessageButtonClicked, data);
    });

    this.client.onMessageReaction((msg: ApiMessageReaction) => {
      this.eventEmitter.emit(Events.MessageReaction, msg);
    });

    this.client.onUserChannelAdded((user: UserChannelAddedEvent) => {
      this.eventEmitter.emit(Events.UserChannelAdded, user);
    });

    this.client.onUserChannelRemoved((msg: UserChannelRemoved) => {
      this.eventEmitter.emit(Events.UserChannelRemoved, msg);
    });

    this.client.onChannelMessage(async (message) => {
      if (message.sender_id && message.sender_id !== BOT_ID) {
        this.eventEmitter.emit(Events.ChannelMessage, message);
      }
    });
    this.client.onAddClanUser(async (user) => {
      console.log('Add clan user', user);
      this.eventEmitter.emit(Events.AddClanUser, user);
    });
  }
}
