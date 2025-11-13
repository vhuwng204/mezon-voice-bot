import { Module } from '@nestjs/common';
import { MCPApiService } from './mcp.api';
import { ListTools } from './tools/listTools';
import { CallTool } from './tools/callTool';
import { ConfigModule } from '@nestjs/config';
import { MCPConnection } from './mcp.connection';
import { McpController } from './mcp.controller';
import { McpService } from './mcp.service';

@Module({
    imports: [ConfigModule],
    controllers: [McpController],
    providers: [MCPConnection, MCPApiService, ListTools, CallTool, McpService],
    exports: [MCPConnection, MCPApiService, ListTools, CallTool, McpService],
})
export class MCPModule { }  