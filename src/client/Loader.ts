import { EventEmitter } from 'events';

import BotCommand from '../structures/Command';
import BotEvent from '../structures/Event';
import sync from '../utils/sync';

import type { Client } from './Client';

export default class Loader extends EventEmitter {
  protected readonly client: Client;

  public constructor(client: Client) {
    super({ captureRejections: true });

    this.client = client;
  }

  public async loadAll(): Promise<void> {
    await this.loadEvents();
    await this.loadCommands();

    this.emit('loaded');
  }

  public async loadCommands(): Promise<void> {
    const paths: string[] = sync('/src/commands/**/*.{ts,js}').sort();
    const loaded: string[] = [];

    for (const path of paths) {
      const command: BotCommand = new (await import(path)).default;

      if (!command.name || !command.enabled || typeof command?.execute != 'function') continue;
      if (!command.category) {
        let splitted: string[];

        if (process.platform === 'win32') splitted = path.split('\\');
        else splitted = path.split('/');
        // @ts-ignore
        // @ts-nocheck
        command.category = splitted[2];
      }

      this.client.commands.set(command.name?.[0] ?? command.name, command);

      loaded.push(command.name?.[0] ?? command.name);
      this.emit('commandLoad', command);
    }

    this.emit('commandsLoaded', loaded);
  }

  public async loadEvents(): Promise<void> {
    const paths: string[] = sync('/src/events/**/*.{ts,js}').sort();
    const loaded: string[] = [];

    for (const path of paths) {
      const event: BotEvent = new (await import(path)).default;

      if (!event.name || !event.enabled || typeof event?.execute != 'function') continue;

      this.client[event.priority](event.type, (...args: any) => event.execute(...args));

      this.client.events.set(event.type, event);

      loaded.push(event.name);
      this.emit('eventLoad', event);
    }

    this.emit('eventsLoaded', loaded);
  }
}

export { Loader };