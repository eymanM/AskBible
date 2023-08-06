import {APIGatewayEvent} from 'aws-lambda';
import {formatJSONResponse} from '../../utils/api-gateway';
import {getFunctionLogger} from '../../utils/logger';

const logger = getFunctionLogger({fileName: __filename});

const generatePolicy = (principalId, effect, resource) => {
  const authResponse: any = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

export async function websocketConnectHandler(event: APIGatewayEvent) {
  try {
    const {connectionId} = event.requestContext;
    logger.info({connectionId}, 'New connection');
    return formatJSONResponse(200, {msg: connectionId})
  } catch (err: any) {
    logger.crit({err}, 'Fatal error')
    return formatJSONResponse(500, {
      stack: err.stack, message: err.message, timestamp: new Date(Date.now()).toISOString()
    })
  }
}

export async function websocketDisconnectHandler(event: APIGatewayEvent) {
  try {
    const {connectionId} = event.requestContext;
    logger.info({connectionId}, 'Disconnecting')
    return formatJSONResponse(200, {msg: connectionId})
  } catch (err: any) {
    logger.crit({err}, 'Fatal error');
    return formatJSONResponse(500, {
      stack: err.stack, message: err.message, timestamp: new Date(Date.now()).toISOString()
    })
  }
}
