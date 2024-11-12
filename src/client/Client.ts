import { Client as BaseClient, Collection, Partials } from 'discord.js';
import Database from './Database';

import database_config from '../../config/database.json';

export default class Client extends BaseClient {
  public readonly commands: Collection<string, BotCommandImplementation> = new Collection();
  public readonly events: Collection<string, BotEventImplementation> = new Collection();
  public readonly database: Database = new Database(database_config);

  public constructor() {
    super({
      intents: 62991,
      partials: [Partials.Channel, Partials.User, Partials.GuildMember, Partials.Message, Partials.Reaction]
    });

    (async () => {
      await this.database.initialize();
      
    })();
  }
}

export { Client };