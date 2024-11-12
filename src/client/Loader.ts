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

  public async reloadAll(): Promise<void> {
    await client.application?.commands.set([]);

    await this.loadAll();

    this.emit('reloaded');
  }

  public async reloadCommand(path: string): Promise<void> {
    const command: BotCommand = new (await import(path)).default;

    if (client.commands.has(command.name?.[0] ?? command.name)) {
      const _command = (await client.application?.commands.fetch())?.find((comm) => comm.name = command.name?.[0] ?? command.name);
      if (_command) await client.application?.commands.delete(_command!);
    }

    client.commands.set(command.name?.[0] ?? command.name, command);
    await client.application?.commands.create(command.toJSON());

    this.emit('reloadCommand', command);
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

  public async reloadEvent(path: string): Promise<void> {
    const event: BotEvent = new (await import(path)).default;

    this.client.off(event.name as string, event.execute);
    this.client[event.priority](event.name as string, event.execute);

    this.emit('reloadEvent', event);
  }

  public async loadEvents(): Promise<void> {
    const paths: string[] = sync('/src/events/**/*.{ts,js}').sort();
    const loaded: string[] = [];

    for (const path of paths) {
      const event: BotEvent = new (await import(path)).default;

      if (!event.name || !event.enabled || typeof event?.execute != 'function') continue;

      this.client[event.priority](event.type, event.execute);

      this.client.events.set(event.type, event);

      loaded.push(event.name);
      this.emit('eventLoad', event);
    }

    this.emit('eventsLoaded', loaded);
  }
}

export { Loader };