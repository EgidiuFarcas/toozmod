import { GuildChannel, GuildMember, Message, TextChannel } from 'discord.js';

export default class MessageTools {

    public static getChannel(message: Message): GuildChannel{
        let args = message.content.split(' ');
        let channel = message.mentions.channels.first() as TextChannel;
        if (!channel) {
            channel = message.guild.channels.cache.get(args[1]) as TextChannel;
            if(!channel) return null;
            return channel;
        }else return channel;
    }

    public static getGuildMember(message: Message): GuildMember{
        let args = message.content.split(' ');
        let member = message.mentions.members.first();
        if (!member) {
            member = message.guild.members.cache.get(args[1]);
            if(!member) return null;
            else return member;
        }else return member;
    }

}