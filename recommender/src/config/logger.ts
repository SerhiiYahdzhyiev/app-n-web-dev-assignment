import path from "path";

export const MAX_LOG_SIZE = 5242880;
export const MAX_LOG_FILES = 5;
export const LOGS_PATH = path.resolve(process.cwd(), 'logs');
export const timeStampOptions = {
  format: 'YYYY-MM-DD HH:mm:ss',
};
