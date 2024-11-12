import { TypedEventEmitter } from 'typeorm';
import chalk from 'chalk';
import moment from 'moment';

moment.locale(process.env.LC_ALL || process.env.LANG || 'en');

const colors = {
  debug: chalk.cyanBright,
  error: chalk.bold.bgRed.white,
  info: chalk.greenBright,
  log: chalk.dim.gray,
  warn: chalk.bold.bgYellow.black
}

export default class Logger extends TypedEventEmitter<LoggerEvents> {
  public constructor() {
    super({ captureRejections: true });
  }

  public log(message: string, type: LoggerTypes) {
    const stackLine = new Error().stack?.split('\n')[2];
    if (!stackLine) throw new Error('Stack trace is unavailable.');

    const match = stackLine.match(/at\s+(\S+)\s+\(([^:]+):(\d+):\d+\)/);
    if (!match) throw new Error('Path could not be parsed.');

    const [,, filename, lineNumber] = match;

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    (console[type] ?? console.log)(colors[type](`${timestamp} [${filename}:${lineNumber}] ${message}`));

    this.emit('_error', message, type, filename, Number(lineNumber));
  }
}

export { Logger };