import type { 
  Client
} from '@client';

import type {
  Client,
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

declare global {
  var client: Client;

  var Embed: typeof EmbedBuilder;
  var Button: typeof ButtonBuilder;
  var Modal: typeof ModalBuilder;
  var ActionRow: typeof ActionRowBuilder;
  var TextInput: typeof TextInputBuilder;
  var Attachment: typeof AttachmentBuilder;
  var StringSelectMenu: typeof StringSelectMenuBuilder;
  var RoleSelectMenu: typeof RoleSelectMenuBuilder;
  var UserSelectMenu: typeof UserSelectMenuBuilder;
  var ChannelSelectMenu: typeof ChannelSelectMenuBuilder;
  var MentionableSelectMenu: typeof MentionableSelectMenuBuilder;
}