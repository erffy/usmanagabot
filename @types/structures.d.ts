// Command.ts
interface BotCommandImplementation {
  public readonly data: import('discord.js').ChatInputApplicationCommandData;
  public readonly enabled: boolean;
  public readonly type: BotCommandTypes;
  public readonly category: BotCommandCategories;
  public readonly cooldown: number;
  public abstract execute(...args: any[]): Promise<void>;
}

interface BotCommandOptions {
  data: import('discord.js').ChatInputApplicationCommandData;

  /**
   * Set status of command
   * @default true
   */
  enabled?: boolean;

  /**
   * Set type of command
   * @default 'standard'
   */
  type?: BotCommandTypes;

  /**
   * Set categories of command
   * @default undefined
   */
  category?: BotCommandCategories;

  /**
   * Set cooldown of command
   * @default 0
   */
  cooldown?: number;
}

type BotCommandTypes = 'standard' | 'customizable';
type BotCommandCategories = undefined | 'admin' | 'core' | 'game' | 'misc' | 'tools' | 'pseudo' | 'utils';
//


// Event.ts
interface BotEventImplementation {
  public readonly type: keyof import('discord.js').ClientEvents | import('discord.js').Events;
  public readonly name?: string;
  public readonly enabled: boolean;
  public readonly priority: BotEventPriority;
  public abstract execute(...args: import('discord.js').ClientEvents[K]): Awaitable<void>;
}

interface BotEventOptions {
  /**
   * Set type of event
   */
  type: keyof import('discord.js').ClientEvents | import('discord.js').Events;

  /**
   * Set name of event
   * @default undefined
   */
  name?: string;

  /**
   * Ser status of event
   * @default true
   */
  enabled?: boolean;

  /**
   * Set priority of event
   * @default 'on'
   */
  priority?: BotEventPriority;
}

type BotEventPriority = 'on' | 'once';
//