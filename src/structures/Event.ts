import type { Awaitable, ClientEvents } from 'discord.js';

export default abstract class BotEvent<K extends keyof ClientEvents = keyof ClientEvents> implements BotEventImplementation {
  public readonly type: keyof ClientEvents;
  public readonly name?: string;
  public readonly enabled: boolean;
  public readonly priority: BotEventPriority;

  protected constructor(options: BotEventOptions) {
    this.type = options.type;
    this.name = options?.name;
    this.enabled = options?.enabled ?? true;
    this.priority = options?.priority ?? 'on';
  }

  public abstract execute(...args: ClientEvents[K]): Awaitable<any>;
}

export { BotEvent };