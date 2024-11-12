import {
  Client as BaseClient, Collection, Partials, 
  
  EmbedBuilder,
  ButtonBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  AttachmentBuilder,
  StringSelectMenuBuilder,
  RoleSelectMenuBuilder,
  UserSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
} from 'discord.js';

import Database from './Database';
import Loader from './Loader';
import Logger from './Logger';


import bot_config from '../../config/bot.json';
import database_config from '../../config/database.json';

import { BotEvent, BotCommand } from '@structures';

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

    global.client = this;
    global.logger = new Logger();

    global.BotCommand = BotCommand;
    global.BotEvent = BotEvent;

    global.Embed = EmbedBuilder;
    global.Button = ButtonBuilder;
    global.Modal = ModalBuilder;
    global.ActionRow = ActionRowBuilder;
    global.TextInput = TextInputBuilder;
    global.Attachment = AttachmentBuilder;
    global.StringSelectMenu = StringSelectMenuBuilder;
    global.RoleSelectMenu = RoleSelectMenuBuilder;
    global.UserSelectMenu = UserSelectMenuBuilder;
    global.ChannelSelectMenu = ChannelSelectMenuBuilder;
    global.MentionableSelectMenu = MentionableSelectMenuBuilder;

    this.loader = new Loader(this);

    (async () => {
      await this.database.initialize();
      await this!.loader.loadAll();
      await this.login(bot_config.token);
    })();
  }
}

export { Client };