import type { PermissionResolvable, ChatInputApplicationCommandData } from 'discord.js';

export default abstract class BotCommand implements BotCommandImplementation {
  public readonly data: ChatInputApplicationCommandData;
  public readonly enabled: boolean;
  public readonly type: BotCommandTypes;
  public readonly category: BotCommandCategories;
  public readonly cooldown: number;

  protected constructor(options: BotCommandOptions) {
    this.data = options.data;
    this.enabled = options?.enabled ?? true;
    this.type = options?.type ?? 'standard';
    this.category = options?.category ?? undefined;
    this.cooldown = options?.cooldown ?? 0;
  }

  public abstract execute(...args: any[]): Promise<any>;
}

export { BotCommand };