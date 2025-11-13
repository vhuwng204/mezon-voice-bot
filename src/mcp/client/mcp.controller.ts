import { Controller, Post, Body, Get } from '@nestjs/common';
import { McpService } from './mcp.service';
import { CallToolParams } from './tools/callTool';

@Controller('mcp')
export class McpController {
    constructor(private readonly mcpService: McpService) { }

    @Get('list-tools')
    async callListTools() {
        return this.mcpService.callListTools();
    }

    @Post('call-tool-gemini-tts')
    async callToolGeminiTTS(@Body() body: CallToolParams) {
        return this.mcpService.handleCallToolGeminiTTS(body);
    }
}