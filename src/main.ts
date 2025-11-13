import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BotGateway } from './bot/events/bot.gateway';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MCPConnection } from './mcp/client/mcp.connection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('Mezon Voice Bot - API')
    .setDescription('Mezon Voice Bot - API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  try {
    const mcpConnection = app.get(MCPConnection);
    const sessionId = await mcpConnection.ensureConnected();
    console.log(`[MCP] Đã kết nối thành công với session ID: ${sessionId}`);
  } catch (error) {
    console.error('[MCP] Lỗi khi kết nối đến MCP server:', error);
    console.error('[MCP] Ứng dụng vẫn sẽ khởi động nhưng MCP có thể không hoạt động.');
  }

  const bot = app.get(BotGateway);
  bot.initEvent();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
