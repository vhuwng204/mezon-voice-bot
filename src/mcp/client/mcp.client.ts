import { Client } from "@modelcontextprotocol/sdk/client/index";
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp';
import {
    ListToolsRequest,
    ListToolsResultSchema,
    ListPromptsRequest,
    ListPromptsResultSchema,
    ListResourcesRequest,
    ListResourcesResultSchema,
} from '@modelcontextprotocol/sdk/types';

export class MCPClient {
    private client: Client | null = null;
    private transport: StreamableHTTPClientTransport | null = null;
    private sessionId: string | undefined = undefined;
    private isConnected = false;
    private readonly DEFAULT_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:8000/mcp';

    async ensureConnected() {
        if (this.isConnected && this.client && this.transport) {
            return this.sessionId;
        }

        this.client = new Client({ name: 'TTS-Server', version: '1.0.0' });
        this.transport = new StreamableHTTPClientTransport(new URL(this.DEFAULT_SERVER_URL));

        await this.client.connect(this.transport);
        this.sessionId = this.transport.sessionId;
        this.isConnected = true;

        return this.sessionId;
    }

    async getListTools() {
        const mcpSessionId = await this.ensureConnected();

        if (!this.client) {
            throw new Error('Client has not been initialized. Call ensureConnected() before calling this method.');
        }

        try {
            const toolsRequest: ListToolsRequest = {
                method: 'tools/list',
                params: {}
            };

            const toolsResult = await this.client.request(toolsRequest, ListToolsResultSchema);

            return {
                mcpSessionId,
                tools: toolsResult.tools.map(tool => ({
                    id: tool.name,
                    name: tool.name,
                    description: tool.description
                }))
            };
        } catch (error) {
            console.error(`Error getting list of tools: ${error}`);
            return { mcpSessionId, tools: [] };
        }
    }

    async getListResources() {
        const mcpSessionId = await this.ensureConnected();

        if (!this.client) {
            throw new Error('Client has not been initialized. Call ensureConnected() before calling this method.');
        }

        try {
            const resourcesRequest: ListResourcesRequest = {
                method: 'resources/list',
                params: {}
            };

            const resourcesResult = await this.client.request(resourcesRequest, ListResourcesResultSchema);

            return {
                mcpSessionId,
                resources: resourcesResult.resources.map(resource => ({
                    id: resource.name,
                    name: resource.name,
                    uri: resource.uri,
                    description: resource.description
                }))
            };
        } catch (error) {
            console.error(`Error getting list of resources: ${error}`);
            return { mcpSessionId, resources: [] };
        }
    }
}