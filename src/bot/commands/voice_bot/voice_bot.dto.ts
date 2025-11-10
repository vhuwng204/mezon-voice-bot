import { ACCESS_LEVEL } from "src/bot/constants";

export class RegisterVoiceDto {
    mezonUserId: string;
    voicePath: string;
    voiceName: string;
    isPrivate: ACCESS_LEVEL;
    isDefault: boolean;
    createdAt: number;
    updatedAt: number;
}