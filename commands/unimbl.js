const Logger = require('../helpers/logger');
const config = require('../config.json');
const UserManager = require('../modules/UserManager');
const RoleManager = require('../modules/RoleManager');

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
        if(RoleManager.removeRole(message, config.imbl_role_name, user.id) === false)
            return message.channel.send('Member is not blacklisted.');
        //Message chat and log
        let msg = `**${message.author.tag}** unblacklisted user **${user.tag}**.`;
        message.channel.send(msg);
        Logger.embed(message, 'Member Unblacklisted', msg, 'ID - ' + user.id, message.author, config.colors.unblacklisted);
    }
}