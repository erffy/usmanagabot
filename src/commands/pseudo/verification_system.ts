import {
    ActionRowBuilder,
    APIActionRowComponent,
    APIMessageActionRowComponent,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType,
    GuildMember,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    TextChannel,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import { DatabaseConnection } from '../../main';
import { Guilds } from '../../types/database/guilds';
import { Users } from '../../types/database/users';
import { Verification } from '../../types/database/verification';
import { Command_t } from '../../types/interface/commands';
import { Logger } from '../../utils/logger';

const settings = async (
    interaction:
        | StringSelectMenuInteraction
        | ModalSubmitInteraction
        | ChannelSelectMenuInteraction
        | RoleSelectMenuInteraction
) => {
    try {
        const verification_system = await DatabaseConnection.manager.findOne(Verification, {
            where: { from_guild: { gid: BigInt(interaction.guild.id) } },
        });

        if (!verification_system) {
            const new_verification = new Verification();
            new_verification.from_guild = await DatabaseConnection.manager.findOne(Guilds, {
                where: { gid: BigInt(interaction.guild.id) },
            });
            new_verification.latest_action_from_user = await DatabaseConnection.manager.findOne(Users, {
                where: { uid: BigInt(interaction.user.id) },
            });
            await DatabaseConnection.manager.save(new_verification);
            return settings(interaction);
        }

        const verification_message = new TextInputBuilder()
            .setCustomId('verification_message')
            .setLabel('Verification Message')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Usable variables:\n{{user}}, {{user_id}}, {{guild}}, {{minimumage}}')
            .setRequired(true);

        const verification_days = new TextInputBuilder()
            .setCustomId('verification_days')
            .setLabel('Verification System Minimum Days')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Minimum days a user must have their account to be verified')
            .setRequired(true);

        let verification_system_status = verification_system.is_enabled ? 'Disable' : 'Enable';

        const channel_select_menu = new ChannelSelectMenuBuilder()
            .setCustomId('settings:verification:21')
            .setPlaceholder('Select a channel')
            .setChannelTypes(ChannelType.GuildText);

        const genMenuOptions = (): APIActionRowComponent<APIMessageActionRowComponent> => {
            const menu = new StringSelectMenuBuilder().setCustomId('settings:verification:0').addOptions([
                {
                    label: `${verification_system_status} Verification system`,
                    description: `${verification_system_status} the verification system`,
                    value: 'settings:verification:1',
                },
                {
                    label: 'Change Verification System Channel',
                    description: 'Change the channel where the verification system',
                    value: 'settings:verification:2',
                },
                {
                    label: 'Change Verification System Role',
                    description: 'Change the role that is given to verified users',
                    value: 'settings:verification:3',
                },
                {
                    label: 'Change Verification System Message',
                    description: 'Change the message that is sent to unverified users',
                    value: 'settings:verification:4',
                },
                {
                    label: 'Change Verification System Minimum Days',
                    description: 'Change the minimum days a user must have their account to be verified',
                    value: 'settings:verification:5',
                },
                { label: 'Back', description: 'Go back to the previous menu', value: 'settings' },
            ]);

            return new ActionRowBuilder()
                .addComponents(menu)
                .toJSON() as APIActionRowComponent<APIMessageActionRowComponent>;
        };

        let menu_path;
        if (interaction.isStringSelectMenu()) {
            menu_path = (interaction as StringSelectMenuInteraction).values[0].split(':').at(-1).split('/');
        } else if (interaction.isModalSubmit() || interaction.isChannelSelectMenu() || interaction.isRoleSelectMenu()) {
            menu_path = (
                interaction as ModalSubmitInteraction | ChannelSelectMenuInteraction | RoleSelectMenuInteraction
            ).customId
                .split(':')
                .at(-1)
                .split('/');
        }

        switch (menu_path[0]) {
            case '1':
                verification_system.is_enabled = !verification_system.is_enabled;
                verification_system_status = verification_system.is_enabled ? 'Disable' : 'Enable';
                await DatabaseConnection.manager.save(verification_system);
                await (interaction as StringSelectMenuInteraction).update({
                    content: `Verification System ${verification_system.is_enabled ? 'enabled' : 'disabled'}`,
                    components: [genMenuOptions()],
                });
                break;
            case '2':
                await (interaction as StringSelectMenuInteraction).update({
                    content: 'Select a channel',
                    components: [
                        new ActionRowBuilder()
                            .addComponents(channel_select_menu)
                            .toJSON() as APIActionRowComponent<APIMessageActionRowComponent>,
                    ],
                });
                break;
            case '21':
                verification_system.channel_id = (interaction as StringSelectMenuInteraction).values[0];
                await DatabaseConnection.manager.save(verification_system);
                await (interaction as StringSelectMenuInteraction).update({
                    content: `Verification System channel set to <#${verification_system.channel_id}>`,
                    components: [genMenuOptions()],
                });
                break;
            case '3': {
                const role_select_menu = new RoleSelectMenuBuilder()
                    .setCustomId('settings:verification:31')
                    .setPlaceholder('Select a role');
                await (interaction as StringSelectMenuInteraction).update({
                    content: 'Select a role',
                    components: [
                        new ActionRowBuilder()
                            .addComponents(role_select_menu)
                            .toJSON() as APIActionRowComponent<APIMessageActionRowComponent>,
                    ],
                });
                break;
            }
            case '31':
                verification_system.role_id = (interaction as StringSelectMenuInteraction).values[0];
                if (
                    interaction.guild.roles.cache
                        .get(verification_system.role_id)
                        .permissions.has(PermissionFlagsBits.Administrator)
                ) {
                    await (interaction as StringSelectMenuInteraction).update({
                        content: 'Cannot set an administrator role as the verification system role',
                        components: [genMenuOptions()],
                    });
                    return;
                }
                await DatabaseConnection.manager.save(verification_system);
                await (interaction as StringSelectMenuInteraction).update({
                    content: `Verification System role set to <@&${verification_system.role_id}>`,
                    components: [genMenuOptions()],
                });
                break;
            case '4':
                await (interaction as StringSelectMenuInteraction).showModal(
                    new ModalBuilder()
                        .setCustomId('settings:verification:41')
                        .setTitle('Verification System Message')
                        .addComponents(
                            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                verification_message.setValue(verification_system.message ?? '')
                            )
                        )
                );
                break;
            case '41':
                verification_system.message = (interaction as ModalSubmitInteraction).fields.getTextInputValue(
                    'verification_message'
                );
                await DatabaseConnection.manager.save(verification_system);
                await (interaction as StringSelectMenuInteraction).update({
                    content: 'Verification System message has been updated',
                    components: [genMenuOptions()],
                });
                break;
            case '5':
                await (interaction as StringSelectMenuInteraction).showModal(
                    new ModalBuilder()
                        .setCustomId('settings:verification:51')
                        .setTitle('Verification System Minimum Days')
                        .addComponents(
                            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                verification_days.setValue(verification_system.minimum_days.toString())
                            )
                        )
                );
                break;
            case '51': {
                const days = parseInt(
                    (interaction as ModalSubmitInteraction).fields.getTextInputValue('verification_days')
                );
                if (isNaN(days)) {
                    await (interaction as StringSelectMenuInteraction).update({
                        content: 'Invalid number',
                        components: [genMenuOptions()],
                    });
                    return;
                }
                verification_system.minimum_days = days;
                await DatabaseConnection.manager.save(verification_system);
                await (interaction as StringSelectMenuInteraction).update({
                    content: `Verification System minimum days set to ${days}`,
                    components: [genMenuOptions()],
                });
                break;
            }
            default:
                await (interaction as StringSelectMenuInteraction).update({
                    content: 'Select a setting',
                    components: [genMenuOptions()],
                });
                break;
        }
    } catch (error) {
        Logger('error', error, interaction);
    }
};

const exec = async (event_name: string, member: GuildMember) => {
    try {
        const verification_system = await DatabaseConnection.manager.findOne(Verification, {
            where: { from_guild: { gid: BigInt(member.guild.id) } },
        });
        if (!verification_system) return;

        const replace_table = [
            { key: '{{user}}', value: `<@${member.id}>` },
            { key: '{{user_id}}', value: member.id },
            { key: '{{guild}}', value: member.guild.name },
            { key: '{{minimumage}}', value: verification_system.minimum_days.toString() },
        ];

        replace_table.forEach((replace) => {
            verification_system.message = verification_system.message.replaceAll(replace.key, replace.value);
        });

        if (
            verification_system.is_enabled &&
            member.user.createdTimestamp > Date.now() - verification_system.minimum_days * 86400000
        ) {
            member.roles.add(verification_system.role_id);
            (member.guild.channels.cache.get(verification_system.channel_id) as TextChannel)?.send(
                verification_system.message
            );
        }
    } catch (error) {
        Logger('error', error, member);
    }
};

export default {
    enabled: true,
    name: 'verification',
    type: 'customizable',
    description: 'Verification system settings wrapper.',

    category: 'pseudo',
    cooldown: 0,
    usage: '/settings',
    usewithevent: ['guildMemberAdd'],

    execute_when_event: exec,
    settings: settings,
} as Command_t;
