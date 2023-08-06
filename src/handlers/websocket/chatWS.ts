import {ApiGatewayManagementApi, PostToConnectionCommand,} from '@aws-sdk/client-apigatewaymanagementapi';
import {APIGatewayEvent} from 'aws-lambda';
import {getFunctionLogger} from '../../utils/logger';
import {streamingType} from '../../models/websocketStreamTypes';

const logger = getFunctionLogger({fileName: __filename});

export async function chattingHandler(event: APIGatewayEvent) {
  const chatWS = new ChatWS(event);
  try {
    await chatWS.completion();
    logger.info('success');
    return {statusCode: 200}
  } catch (err) {
    await chatWS.sendToClient('error', null, {
      stack: err.stack,
      message: err.message,
      timestamp: new Date().toISOString()
    });
    return {statusCode: 500}
  }
}

export async function createChatHandler(event: APIGatewayEvent) {
  const chatWS = new ChatWS(event);
  try {
    await chatWS.createChat();
    return {statusCode: 200}
  } catch (err) {
    await chatWS.sendToClient('error', null, {
      stack: err.stack,
      message: err.message,
      timestamp: new Date().toISOString()
    });
    return {statusCode: 500}
  }
}

class ChatWS {
  readonly textEncoder = new TextEncoder();
  readonly endpoint: string;
  public requestBody: any;
  private connectionId: string;
  private apiGatewayManagementApi: ApiGatewayManagementApi;

  constructor(event: APIGatewayEvent) {
    const domainName = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    this.connectionId = event.requestContext.connectionId;
    this.endpoint = `https://${domainName}/${stage}`;
    this.requestBody = JSON.parse(event.body) as {
      chatId: string,
      input: string,
    };

    this.apiGatewayManagementApi = new ApiGatewayManagementApi({
      endpoint: this.endpoint,
    });
  }

  readonly encodeText = (text: string) => this.textEncoder.encode(text);

  async completion() {
    if (!this.requestBody.chatId || !this.requestBody.input) {
      await this.sendToClient('error', '', {
        message: 'chatId and input and token are required in body',
        timestamp: new Date(Date.now()).toISOString()
      });
      return {statusCode: 422}
    }
    this.sendToClient('start');
    await this.sendToClient('end');
  }

  async createChat() {
    if (!this.requestBody.authorization) {
      await this.sendToClient('error', '', {
        message: 'authorization prop is required in body',
        timestamp: new Date(Date.now()).toISOString()
      });
      return {statusCode: 422}
    }
    this.sendToClient('start');
    await this.sendToClient('end');
  }

  async sendToClient(type: streamingType, interactionId: string = undefined, data: string | object = undefined) {
    const dataType = typeof data;
    const stringifiedData = JSON.stringify({
      ...(interactionId && {interactionId}),
      type,
      ...(data && {data, dataType})
    });
    const command = new PostToConnectionCommand({
      ConnectionId: this.connectionId,
      Data: this.encodeText(stringifiedData),
    });
    await this.apiGatewayManagementApi.send(command);
  }
}
