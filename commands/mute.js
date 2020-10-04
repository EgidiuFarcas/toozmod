const config = require('../config.json');
const Logger = require('../helpers/logger');
const Helpers = require('../helpers/functions');
const ms = require("ms");

module.exports = {
    name: 'mute',
    description: 'Mute a user',
    execute(message, args) {
        let user = Helpers.getUser(message, args);
        if(user === null) {
            message.reply('Couldn\'t get a Discord user with this userID!');
            console.log('Couldn\'t get a Discord user with this userID!');
            return;
        }
        let time = args[2];
        if(time === '0') time = 'forever';
        let muteReason = args.slice(3).join(' ');

        if (user === message.author) return message.channel.send('You can\'t mute yourself');
        if (!muteReason) return message.reply('You forgot to enter a reason for this mute!');
        if(!time) return message.reply('You forgot to enter a duration for this mute!');

        let role = message.guild.roles.cache.find(r => r.name === config.muted_role_name);
        if(!role) return message.reply('Muted role doesn\'t exist!');

        try {
            message.guild.members.cache.get(user.id).roles.add(role);
        }catch (err) {
            console.log(err);
            return;
        }

        let msg = `**${message.author.tag}** muted user **${user.tag}** for **${time}** because: **${muteReason}**.`;
        message.channel.send(msg);
        Logger.embed(message,
            'Member Muted',
            msg,
            'ID - ' + user.id,
            message.author, config.colors.muted);

        setTimeout(function(){
            let member = message.guild.members.cache.get(user.id);
            if(member.roles.cache.has(role.id)) member.roles.remove(role).catch(err => console.log(err));
            let msg = `**${message.client.user.tag}** unmuted user **${user.tag}**.`;
            Logger.embed(message,
                'Member Unmuted',
                msg,
                'ID - ' + user.id,
                message.client.user, config.colors.unmuted);
        }, ms(time));
    }
}