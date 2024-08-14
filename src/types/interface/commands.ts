import { ChatInputCommandInteraction, CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { Guilds } from "../database/guilds";

export interface Command_t {
    enabled: boolean;
    name: string;
    type: 'customizable' | 'standard';
    description: string;

    category: 'admin' | 'core' | 'game' | 'misc' | 'tools' | 'pseudo' |'utils';
    cooldown: number;
    usage: string;

    data: (guild?: Guilds) => Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | Promise<Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>>;
    execute: (interaction: CommandInteraction | ChatInputCommandInteraction | Interaction, ...args: any[]) => Promise<void>;
    settings?: (interaction: any) => Promise<void>;
}