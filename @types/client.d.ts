// Logger.ts
type LoggerTypes = 'debug' | 'error' | 'info' | 'log' | 'warn';
type LoggerEvents = {
  '_error': (message: string, type: LoggerTypes, filename: string, lineNumber: number) => void;
}

// Loader.ts
type LoaderEvents = {
  'loaded': () => void;
  'reloaded': () => void;
  'commandLoad': (command: BotCommandImplementation) => void;
  'reloadCommand': (command: BotCommandImplementation) => void;
  'commandsLoaded': (loaded: string[]) => void;
  'reloadEvent': (event: BotEventImplementation) => void;
  'eventLoad': (event: BotEventImplementation) => void;
  'eventsLoaded': (loaded: string[]) => void;
}