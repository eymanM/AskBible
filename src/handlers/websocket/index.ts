import {handlerPath} from '../../utils/handler-resolver';

export const onWSConnect = {
  handler: `${handlerPath(__dirname)}/connection.websocketConnectHandler`,
  events: [
    {
      websocket: {
        route: '$connect',
      },
    },
  ],
};

export const onWSDisconnect = {
  handler: `${handlerPath(__dirname)}/connection.websocketDisconnectHandler`,
  events: [
    {
      websocket: {
        route: '$disconnect',
      },
    },
  ],
};

export const onCompletion = {
  handler: `${handlerPath(__dirname)}/chatWS.chattingHandler`,
  events: [
    {
      websocket: {
        route: 'completion',
      },
    },
  ],
  timeout: 500
};

export const onCreateChat = {
  handler: `${handlerPath(__dirname)}/chatWS.createChatHandler`,
  events: [
    {
      websocket: {
        route: 'createChat',
      },
    },
  ],
  timeout: 500
};
