import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMessage } from 'mezon-sdk';
import { UserVoice } from 'src/bot/models/user_voice.entity';
import { Repository } from 'typeorm';
import { RegisterVoiceDto } from './voice_bot.dto';
import { MezonClientService } from 'src/mezon/client.service';
import { ACCESS_LEVEL } from 'src/bot/constants/bot';

@Injectable()
export class VoiceBotService {
    constructor(
        private readonly mezonClientService: MezonClientService,
        @InjectRepository(UserVoice)
        private readonly userVoiceRepository: Repository<UserVoice>,
    ) { }

    private async registerVoice(registerVoiceDto: RegisterVoiceDto): Promise<{ success: boolean, message: string, voiceId?: number | undefined }> {
        const { voiceName, mezonUserId } = registerVoiceDto;
        if (await this.userVoiceRepository.findOne({ where: { voiceName, mezonUserId } })) {
            return {
                success: false,
                message: 'Voice already exists',
                voiceId: undefined,
            };
        }
        else if (await this.userVoiceRepository.findOne({ where: { mezonUserId, isDefault: true } })) {
            registerVoiceDto.isDefault = true;
        }
        let res = await this.userVoiceRepository.insert(registerVoiceDto);
        return {
            success: true,
            message: 'Voice registered successfully',
            voiceId: res.identifiers[0].id,
        };
    }

    private async cloneVoice(message: ChannelMessage, cloneVoiceName: string): Promise<void> {
        const cloneVoice = await this.userVoiceRepository.findOne({ where: { voiceName: cloneVoiceName } });
        if (!cloneVoice) {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Voice name does not exist. Please register it first.`,
                },
                channel_id: message.channel_id,
            });
            return;
        }

        const response = await this.registerVoice({
            mezonUserId: message.sender_id,
            voiceName: cloneVoiceName,
            voicePath: cloneVoice?.voicePath || '',
            isPrivate: cloneVoice?.isPrivate || ACCESS_LEVEL.PUBLIC,
            isDefault: false,
            createdBy: cloneVoice?.mezonUserId || '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        if (response.success) {
            await this.userVoiceRepository.increment({ id: cloneVoice?.id, createdBy: cloneVoice?.createdBy }, 'number_usage', 1);
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Voice cloned successfully`,
                },
                channel_id: message.channel_id,
            });
        } else {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Voice cloning failed: ${response.message}`,
                },
                channel_id: message.channel_id,
            });
        }
    }

    async handleRegisterVoice(message: ChannelMessage) {
        const parts = message.content.t?.trim().split(/\s+/) || [];
        let command = parts.shift();
        let type = parts.shift();
        let voiceName = parts.join(' ');
        if (!command || !type || !voiceName) {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Register voice command syntax: *register_voice <private|public> <voice_name>`,
                },
                channel_id: message.channel_id,
            });
            return;
        }

        if (type !== ACCESS_LEVEL.PRIVATE && type !== ACCESS_LEVEL.PUBLIC) {
            await this.mezonClientService.sendMessage({
                msg: {
                    t: `Invalid access level. Use 'private' or 'public'`,
                },
                channel_id: message.channel_id,
            });
            return;
        }

        if (!message.attachments || message.attachments.length === 0) {
            await this.mezonClientService.sendMessage({
                msg: {
                    t: `Please attach a voice file`,
                },
                channel_id: message.channel_id,
            });
            return;
        }

        let response = await this.registerVoice({
            mezonUserId: message.sender_id,
            voiceName: voiceName,
            voicePath: message.attachments[0]?.url || '',
            isPrivate: type === ACCESS_LEVEL.PRIVATE ? ACCESS_LEVEL.PRIVATE : ACCESS_LEVEL.PUBLIC,
            isDefault: false,
            createdBy: message.sender_id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        if (response.success) {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Voice registered successfully: ${voiceName}`,
                },
                channel_id: message.channel_id,
            });
        } else {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Voice registration failed: ${voiceName} already exists`,
                },
                channel_id: message.channel_id,
            });
        }
    }
    async handleCloneVoice(message: ChannelMessage) {
        const parts = message.content.t?.trim().split(/\s+/) || [];
        let command = parts.shift();
        let cloneVoiceName = parts.join(' ');
        if (!command || !cloneVoiceName) {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: {
                    t: `Clone voice command syntax: *clone_voice <voice_name>`,
                },
                channel_id: message.channel_id,
            });
            return;
        }
        await this.cloneVoice(message, cloneVoiceName);
    }
    async handleGetListVoice(message: ChannelMessage) {
        console.log(message);
        const voices = await this.userVoiceRepository.find();
        if (voices.length === 0) {
            await this.mezonClientService.sendMessage({
                mode: 1,
                msg: { t: `You have no voices` },
                channel_id: message.channel_id,
            });
            return;
        }

        const sorted = voices.sort((a, b) => {
            const aPublic = a.isPrivate === ACCESS_LEVEL.PUBLIC ? 0 : 1;
            const bPublic = b.isPrivate === ACCESS_LEVEL.PUBLIC ? 0 : 1;
            return aPublic - bPublic;
        });

        const lines = sorted.map((v, idx) => `${idx + 1}. [${v.isPrivate}] ${v.voiceName}`);
        const header = `List of voices:`;
        await this.mezonClientService.sendMessage({
            mode: 1,
            msg: { t: `${header}\n${lines.join('\n')}` },
            channel_id: message.channel_id,
        });
    }
    async handleShowHelpMessage(message: ChannelMessage) {
        const helpMessage = `**Voice Bot Commands:**
        *register_voice <private|public> <voice_name> & <attach a voice file> - Register a new voice
        *clone_voice <voice_name> - Clone a voice from another user
        *list_voice - List all voices
        *play_audio <voice_name> - Play a voice
        *bot_help - Show this help message
        `;
        await this.mezonClientService.sendMessage({
            mode: 1,
            msg: { t: helpMessage },
            channel_id: message.channel_id,
        });
    }
}