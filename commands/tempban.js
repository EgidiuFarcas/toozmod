const Logger = require('../helpers/logger');
const Helpers = require('../helpers/functions');
const config = require('../config.json');
const ms = require("ms");

module.exports = {
    name: 'tempban',
    description: 'Temp Ban a user',
    async execute(message, args) {
        let banReason = args.slice(3).join(' ');
        let time = args[2];

        let user = Helpers.getUser(message, args);
        if(user === null) {
            message.reply('Couldn\'t get a Discord user with this userID!');
            console.log('Couldn\'t get a Discord user with this userID!');
            return;
        }

        if (user === message.author) return message.channel.send('You can\'t ban yourself');
        if (!banReason) return message.reply('You forgot to enter a reason for this ban!');
        if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!');

        await message.guild.member(user).ban({ reason: banReason});// Bans the user
        let msg = `**${message.author.tag}** banned user **${user.tag}** for **${time}** because: **${banReason}**.`;
        message.channel.send(msg);
        Logger.embed(message,
            'Member Banned',
            msg,
            'ID - ' + user.id,
            message.author, config.colors.tempbanned);

        setTimeout(function(){
            message.guild.fetchBans().then(async users => {
                users.get(user);
                await message.guild.members.unban(user);
                let msg = `**${message.client.user.tag}** unbanned user **${user.tag}**.`;
                Logger.embed(message,
                    'Member Unbanned',
                    msg,
                    'ID - ' + user.id,
                    message.client.user, config.colors.unbanned);
            }).catch(err => console.log(err));
        }, ms(time));
    }
}