import { clc, yellow } from "./colors";

/**
 * @publicApi
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

const DEFAULT_LOG_LEVELS: LogLevel[] = [
  'log',
  'error',
  'warn',
  'debug',
  'fatal',
];

export interface ConsoleLoggerOptions {
  /**
   * Enabled log levels.
   */
  logLevels?: LogLevel[];
  /**
   * If enabled, will print timestamp (time difference) between current and previous log message.
   */
  timestamp?: boolean;
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  verbose: 0,
  debug: 1,
  log: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  day: '2-digit',
  month: '2-digit',
});

function isLogLevelEnabled(
  targetLevel: LogLevel,
  logLevels: LogLevel[] | undefined,
): boolean {
  if (!logLevels || (Array.isArray(logLevels) && logLevels?.length === 0)) {
    return false;
  }
  if (logLevels.includes(targetLevel)) {
    return true;
  }
  const highestLogLevelValue = logLevels
    .map(level => LOG_LEVEL_VALUES[level])
    .sort((a, b) => b - a)?.[0];

  const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
  return targetLevelValue >= highestLogLevelValue;
}

/**
 * @publicApi
 */
export interface LoggerService {

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]): void;

  verbose(message: any, ...optionalParams: any[]): void;

}


export class Logger implements LoggerService {
  private originalContext?: string;
  private options?: ConsoleLoggerOptions

  constructor(context?: string, options: ConsoleLoggerOptions = {}) {
    if (!options?.logLevels) {
      options.logLevels = DEFAULT_LOG_LEVELS;
    }
    if (context) {
      this.originalContext = context;
    }

    this.options = options
  }
  verbose(message: any, ...optionalParams: any[]): void {    
    if (!this.isLevelEnabled('verbose')) {
      return;
    }
    this.printMessages(message, this.getContext(), 'verbose');
  }

  log(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('log')) {
      return;
    }
    this.printMessages(message, this.getContext(), 'log');
  }

  isLevelEnabled(level: LogLevel): boolean {
    const logLevels = this.options?.logLevels;
    return isLogLevelEnabled(level, logLevels);
  }

  private printMessages(
    message: string,
    context = '',
    LogLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    const formattedMessage = this.formatMessage(message,context,LogLevel)
    process[writeStreamType ?? 'stdout'].write(formattedMessage + '\n');
  }

  private getContext() {
    return this.originalContext || 'SDK'
  }

  private formatMessage(messages: string,context:string,LogLevel: LogLevel) {
    let color = this.getColorByLogLevel(LogLevel)
    const contextMessage = yellow(`[${context}] `)
    const timestamp = dateTimeFormatter.format(Date.now());
    const formattedLogLevel = LogLevel.toUpperCase().padStart(7, ' ')


    return `${color('[ShopeeSDK] -')} ${timestamp} ${color(formattedLogLevel)} ${color(contextMessage)}${color(messages)}`
  }


  private getColorByLogLevel(level: LogLevel) {
    switch (level) {
      case 'debug':
        return clc.magentaBright;
      case 'warn':
        return clc.yellow;
      case 'error':
        return clc.red;
      case 'verbose':
        return clc.cyanBright;
      case 'fatal':
        return clc.bold;
      default:
        return clc.green;
    }
  }

}