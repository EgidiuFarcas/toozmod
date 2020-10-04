const Logger = require('../helpers/logger');
const config = require('../config.json');
const Helpers = require('../helpers/functions');

module.exports = {
    name: 'unmute',
    description: 'Unmute a user',
    execute(message, args) {
        let user = Helpers.getUser(message, args);
        if(user === null) {
            message.reply('Couldn\'t get a Discord user with this userID!');
            console.log('Couldn\'t get a Discord user with this userID!');
            return;
        }

        if (user === message.author) return message.channel.send('You can\'t mute yourself');

        let role = message.guild.roles.cache.find(r => r.name === config.muted_role_name);
        if(!role) return message.reply('Muted role doesn\'t exist!');
        try {
            let member = message.guild.members.cache.get(user.id);
            if(member.roles.cache.has(role.id)) member.roles.remove(role).catch(err => console.log(err));
            else return message.channel.send('Member is not muted.');
        }catch (err) {
            console.log(err);
            return;
        }

        let msg = `**${message.author.tag}** unmuted user **${user.tag}**.`;
        message.channel.send(msg);
        Logger.embed(message,
            'Member Unmuted',
            msg,
            'ID - ' + user.id,
            message.client.user, config.colors.unmuted);
    }
}