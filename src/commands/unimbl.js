const Logger = require('../helpers/logger');
const config = require('../config.json');
const UserManager = require('../modules/UserManager');
const Actions = require('../helpers/actions');

module.exports = {
    name: 'unimbl',
    description: 'Unblacklist a user',
    execute(message, args) {
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for self unblacklisting
        if (user === message.author) return message.channel.send('You can\'t unblacklist yourself');
        //Try to unblacklist user
        let msg = `**${message.author.tag}** unblacklisted user **${user.tag}**.`;
        if(Actions.unblacklist(message, user, true, msg) === true)
            message.channel.send(msg);
        else message.channel.send('Member is not blacklisted.');
    }
}