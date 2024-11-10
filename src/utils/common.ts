import { Interaction, Message } from 'discord.js';
import { DatabaseConnection } from '../main';
import { Channels } from '../types/database/channels';
import { Users } from '../types/database/users';

export const CheckAndAddUser = async (message?: Message, interaction?: Interaction): Promise<Users> => {
    if (message && message.author?.bot) return null;
    const user_name = message ? message.author?.username : interaction?.user.username;
    const user_id = message ? BigInt(message.author?.id) : BigInt(interaction?.user.id);
    return await DatabaseConnection.manager
        .findOne(Users, { where: { uid: user_id } })
        .then((user) => {
            if (user) return user;
            const new_user = new Users();
            new_user.name = user_name;
            new_user.uid = user_id;
            return DatabaseConnection.manager.save(new_user);
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
};

export const CheckAndAddChannel = async (message?: Message, interaction?: Interaction): Promise<Channels> => {
    if (message && message.author?.bot) return null;
    const channel_id = message ? BigInt(message.channel.id) : BigInt(interaction?.channelId);
    return await DatabaseConnection.manager
        .findOne(Channels, { where: { cid: channel_id } })
        .then((channel) => {
            if (channel) return channel;
            const new_channel = new Channels();
            new_channel.cid = channel_id;
            return DatabaseConnection.manager.save(new_channel);
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
};
