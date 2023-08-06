import {AWS} from '@serverless/typescript';
import * as lambdaFunctionsConfig from './src/handlers';

const serverlessConfiguration: AWS = {
  service: 'ask-bible',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    versionFunctions: false,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    //websocketsApiName: 'websockets-${self:service}',
    //websocketsApiRouteSelectionExpression: '$request.body.action',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SERVICE: '${self:service}',
      STAGE: '${opt:stage}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'lambda:InvokeFunction'
        ],
        Resource: '*'
      },
      {
        Effect: 'Allow',
        Action: [
          's3:*'
        ],
        Resource: '*',
      }
    ]
  },

  functions: lambdaFunctionsConfig,
  package: {
    excludeDevDependencies: true,
    patterns: [
      '!.git/**',
      '!.gitignore',
      '!yarn-*.log',
      '!.serverless/**',
      '!.serverless_plugins/**',
      '!.vscode/**/*',
      '!.idea/**/*',
      '!loadVectorsToDb.ts',
    ],
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node18',
      define: {'require.resolve': undefined},
      platform: 'node',
      exclude: ['aws-sdk', 'typescript', 'prettier']
    },
  },
};

module.exports = serverlessConfiguration;
