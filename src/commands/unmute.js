const Actions = require('../utils/Actions');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'unmute',
    description: 'Unmute a user',
    execute(message, args) {
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for self unmuting
        if (user === message.author) return message.channel.send('You can\'t unmute yourself');
        //Try to unmute user
        let msg = `**${message.author.tag}** unmuted user **${user.tag}**.`;
        if(Actions.unmute(message, user, true, msg) === true)
            message.channel.send(msg);
        else message.channel.send('Member is not muted.');

    }
}