import { createLogger, transports, format } from "winston";

import { LOGS_PATH, MAX_LOG_SIZE, MAX_LOG_FILES, timeStampOptions } from "./config/logger";

const { combine, timestamp, printf } = format;


const getTransports = () => {
  const { File, Console } = transports;
  const outFileOptions = {
    filename: LOGS_PATH + '/out.log',
    json: false,
    maxsize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    level: 'info',
  };
  const errorFileOptions = {
    filename: LOGS_PATH + '/error.log',
    json: false,
    maxsize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    level: 'error',
  };
  return [
    new File(outFileOptions),
    new File(errorFileOptions),
    new Console({
      // json: false 
    }),
  ];
};

const loggerFormat = combine(
  timestamp(timeStampOptions),
  printf(
    (info) => {
      return `${info.timestamp} ${info.level} [${info.label || "unlabeled"}]: ${info.message}`;
    }
  )
);

const loggerOptions = {
  format: loggerFormat,
  transports: getTransports(),
};

export const logger = createLogger(loggerOptions);
