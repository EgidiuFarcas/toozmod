const config = require('../config.json');
const Logger = require('../helpers/logger');
const UserManager = require('../modules/UserManager');
const RoleManager = require('../modules/RoleManager');
const Actions = require('../helpers/actions');
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

        let msg = `**${message.author.tag}** blacklisted user **${user.tag}** for **${time}** because: **${reason}**.`;
        if(Actions.blacklist(message, user, true, msg) === true)
            message.channel.send(msg);
        else return message.channel.send("Something went wrong.");

        //If duration is forever, don't add a timeout
        if(time === 'forever') return;
        //Else, create a timeout to remove the role
        setTimeout(function(){
            let msg = `**${message.client.user.tag}** unblacklisted user **${user.tag}**.`;
            Actions.unblacklist(message, user, true, msg, message.client.user);
        }, ms(time));
    }
}