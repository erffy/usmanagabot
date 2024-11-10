import { Events, Message } from 'discord.js';
import { BotCommands, DatabaseConnection } from '../../main';
import { Messages } from '../../types/database/messages';
import { Event_t } from '../../types/interface/events';
import { CheckAndAddChannel, CheckAndAddUser } from '../../utils/common';
import { Logger } from '../../utils/logger';

const exec = async (oldMessage: Message, newMessage: Message) => {
    if ((oldMessage.author?.bot && newMessage.author?.bot) || (!oldMessage.author?.id && newMessage.author?.id)) return;

    await CheckAndAddUser(oldMessage, null);
    await CheckAndAddChannel(oldMessage, null);

    const old_message_in_db = await DatabaseConnection.manager.findOne(Messages, {
        where: { message_id: BigInt(oldMessage.id) },
    });
    if (!old_message_in_db) {
        Logger('warn', `Message ${oldMessage.id} not found in database`);
        return;
    }

    old_message_in_db.message_is_edited = true;

    await DatabaseConnection.manager.save(old_message_in_db);

    for (const [, cmd_data] of BotCommands.get(BigInt(oldMessage.guild?.id)).concat(BotCommands.get(BigInt(0)))) {
        if (cmd_data.usewithevent?.includes('messageUpdate')) {
            cmd_data.execute_when_event('messageUpdate', oldMessage, newMessage);
        }
    }
};

export default {
    enabled: true,
    once: false,
    name: 'messageUpdate',
    data: Events.MessageUpdate,
    execute: exec,
} as Event_t;
