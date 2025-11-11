import { Module } from '@nestjs/common';
import { MCPApiService } from './mcp.api';
import { ListTools } from './tools/listTools';
import { CallTool } from './tools/callTool';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [MCPApiService, ListTools, CallTool],
    exports: [MCPApiService, ListTools, CallTool],
})
export class MCPModule { }  