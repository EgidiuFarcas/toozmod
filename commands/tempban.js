const Logger = require('../helpers/logger');
const UserManager = require('../modules/UserManager');
const config = require('../config.json');
const ms = require("ms");

module.exports = {
    name: 'tempban',
    description: 'Temp Ban a user',
    async execute(message, args) {
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get duration
        let duration = args[2];
        //Get reason
        let banReason = args.slice(3).join(' ');
        //Check for command completion, self banning and over ranking
        if (user === message.author) return message.channel.send('You can\'t ban yourself');
        if (!banReason) return message.reply('You forgot to enter a reason for this ban!');
        if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!');
        //Ban the user
        await message.guild.member(user).ban({ reason: banReason});
        //Message chat and log
        let msg = `**${message.author.tag}** banned user **${user.tag}** for **${time}** because: **${banReason}**.`;
        message.channel.send(msg);
        Logger.embed(message, 'Member Temporarily Banned', msg, 'ID - ' + user.id, message.author, config.colors.tempbanned);
        //Setup timer until unban
        setTimeout(function(){
            //Look through bans
            message.guild.fetchBans().then(async users => {
                //Check if the user is still banned
                let usr = users.get(user);
                if(!usr) return;
                //Unban the user
                await message.guild.members.unban(user);
                //Message chat and log
                let msg = `**${message.client.user.tag}** unbanned user **${user.tag}**.`;
                Logger.embed(message, 'Member Unbanned', msg, 'ID - ' + user.id, message.client.user, config.colors.unbanned);
            //Catch any errors
            }).catch(err => console.log(err));

        }, ms(duration));
    }
}