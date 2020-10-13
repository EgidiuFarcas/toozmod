const Actions = require('../utils/Actions');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'ban',
    description: 'Ban a user',
    async execute(message, args) {
        let reason = args.slice(2).join(' ');
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for command completion, self banning or rank bypassing
        if (!reason) return message.reply('You forgot to enter a reason for this ban!');
        if (user === message.author) return message.channel.send('You can\'t ban yourself');
        if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!');
        //Ban the user
        let msg = `**${message.author.tag}** banned user **${user.tag}** because: **${reason}**.`;
        if(Actions.ban(message, user, true, msg, reason) === true)
            message.channel.send(msg);
    }
}