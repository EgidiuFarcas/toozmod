const config = require('../config.json');
const Logger = require('../helpers/logger');
const UserManager = require('../modules/UserManager');
const RoleManager = require('../modules/RoleManager');
const ms = require("ms");

module.exports = {
    name: 'imbl',
    description: 'Blacklist a user',
    execute(message, args) {
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get duration
        let time = args[2];
        if(time === '0') time = 'forever';
        //Get reason
        let reason = args.slice(3).join(' ');
        //Check for command completion and self blacklisting
        if (!reason) return message.reply('You forgot to enter a reason for this blacklist!');
        if(!time) return message.reply('You forgot to enter a duration for this blacklist!');
        if (user === message.author) return message.channel.send('You can\'t blacklist yourself');
        //Try to add role
        if(RoleManager.addRole(message, config.imbl_role_name, user.id) === false) return;
        //Message chat and log
        let msg = `**${message.author.tag}** blacklisted user **${user.tag}** for **${time}** because: **${reason}**.`;
        message.channel.send(msg);
        Logger.embed(message, 'Member Blacklisted', msg, 'ID - ' + user.id, message.author, config.colors.blacklisted);
        //If duration is forever, don't add a timeout
        if(time === 'forever') return;
        //Else, create a timeout to remove the role
        setTimeout(function(){
            //Try to remove the role
            if(RoleManager.removeRole(message, config.imbl_role_name, user.id) === false) return;
            //Message chat and log
            let msg = `**${message.client.user.tag}** unblacklisted user **${user.tag}**.`;
            Logger.embed(message, 'Member Unblacklisted', msg, 'ID - ' + user.id, message.client.user, config.colors.unblacklisted);

        }, ms(time));
    }
}