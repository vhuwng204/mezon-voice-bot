import { Injectable } from "@nestjs/common";
import { ListTools } from "./tools/listTools";
import { CallTool, CallToolParams, CallToolResponse } from "./tools/callTool";

@Injectable()
export class McpService {
    constructor(private readonly listTools: ListTools, private readonly callTool: CallTool) { }

    async callListTools() {
        return this.listTools.getListTool();
    }

    async handleCallToolGeminiTTS(params: CallToolParams): Promise<CallToolResponse> {
        return this.callTool.callTool(params);
    }
}