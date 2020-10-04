const config = require('../config.json');
const Logger = require('../helpers/logger');
const UserManager = require('../modules/UserManager');
const RoleManager = require('../modules/RoleManager');
const ms = require("ms");

module.exports = {
    name: 'mute',
    description: 'Mute a user',
    execute(message, args) {
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get duration
        let duration = args[2];
        if(duration === '0') duration = 'forever';
        //Get reason
        let reason = args.slice(3).join(' ');
        //Check for command completion and self muting
        if (!reason) return message.reply('You forgot to enter a reason for this mute!');
        if(!duration) return message.reply('You forgot to enter a duration for this mute!');
        if (user === message.author) return message.channel.send('You can\'t mute yourself');
        //Try to add role
        if(RoleManager.addRole(message, config.muted_role_name, user.id) === false) return;
        //Message chat and log
        let msg = `**${message.author.tag}** muted user **${user.tag}** for **${duration}** because: **${reason}**.`;
        message.channel.send(msg);
        Logger.embed(message, 'Member Muted', msg, 'ID - ' + user.id, message.author, config.colors.muted);
        //If duration is forever, dont add a timeout
        if(duration === 'forever') return;
        //Else, create a timeout to remove the role
        setTimeout(function(){
            //Try to remove role
            if(RoleManager.removeRole(message, config.muted_role_name, user.id) === false) return;
            //Message chat and log
            let msg = `**${message.client.user.tag}** unmuted user **${user.tag}**.`;
            Logger.embed(message, 'Member Unmuted', msg, 'ID - ' + user.id, message.client.user, config.colors.unmuted);

        }, ms(duration));
    }
}