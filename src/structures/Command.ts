import type { ApplicationCommandDataResolvable, PermissionResolvable } from 'discord.js';

export default abstract class BotCommand implements BotCommandImplementation {
  public readonly name: string | string[];
  public readonly description: string;
  public readonly enabled: boolean;
  public readonly type: BotCommandTypes;
  public readonly category: BotCommandCategories;
  public readonly permissions: PermissionResolvable;
  public readonly cooldown: number;

  protected constructor(options: BotCommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.enabled = options?.enabled ?? true;
    this.type = options?.type ?? 'standard';
    this.category = options?.category ?? undefined;
    this.cooldown = options?.cooldown ?? 0;
    this.permissions = options?.permissions ?? [];
  }

  public toJSON(): ApplicationCommandDataResolvable {
    return {
      name: this.name?.[0] ?? this.name,
      description: this.description,
      defaultMemberPermissions: this.permissions
    }
  }

  public abstract execute(...args: any[]): Promise<any>;
}

export { BotCommand };