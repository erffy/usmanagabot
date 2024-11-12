// Logger.ts
type LoggerTypes = 'debug' | 'error' | 'info' | 'log' | 'warn';
type LoggerEvents = {
  '_error': (message: string, type: LoggerTypes, filename: string, lineNumber: number) => void;
}