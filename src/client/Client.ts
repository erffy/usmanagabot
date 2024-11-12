import { Client as BaseClient, Collection, Partials } from 'discord.js';
import Database from './Database';
import Loader from './Loader';

import database_config from '../../config/database.json';

import type { BotEvent, BotCommand } from '@structures';

export default class Client extends BaseClient {
  public readonly commands: Collection<string, BotCommand> = new Collection();
  public readonly events: Collection<string, BotEvent> = new Collection();
  public readonly database: Database = new Database(database_config);
  public readonly loader: Loader;

  public constructor() {
    super({
      intents: 62991,
      partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message, Partials.Reaction]
    });

    this.loader = new Loader(this);

    (async () => {
      await this.database.initialize();
      
    })();
  }
}

export { Client };