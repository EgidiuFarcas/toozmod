const Logger = require('../helpers/logger');
const config = require('../config.json');
const UserManager = require('../modules/UserManager');
const RoleManager = require('../modules/RoleManager');

module.exports = {
    name: 'unmute',
    description: 'Unmute a user',
    execute(message, args) {
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for self unmuting
        if (user === message.author) return message.channel.send('You can\'t unmute yourself');
        //Try to unmute user
        if(RoleManager.removeRole(message, config.muted_role_name, user.id) === false)
            return message.channel.send('Member is not muted.');
        //Message chat and log
        let msg = `**${message.author.tag}** unmuted user **${user.tag}**.`;
        message.channel.send(msg);
        Logger.embed(message, 'Member Unmuted', msg, 'ID - ' + user.id, message.author, config.colors.unmuted);
    }
}