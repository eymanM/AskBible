import pino from 'pino';
import {pinoLambdaDestination, PinoLogFormatter} from 'pino-lambda';
import {v4} from 'uuid';

const customLevels = {
  emerg: 70,
  crit: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
};

const logger = pino({
    base: undefined,
    level: 'info',
    maxDepth: 3,
    customLevels,
    useOnlyCustomLevels: true,
    formatters: {
      level: (label) => {
        return {level: label};
      },
    },
  },
  pinoLambdaDestination({formatter: new PinoLogFormatter()}));

export const getFunctionLogger = (fProps = null) => {
  if (!fProps) fProps = {jobId: v4()};

  if (!fProps.jobId) fProps.jobId = v4();
  return logger.child({...fProps});
};

