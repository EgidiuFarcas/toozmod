const config = require('../config.json');
const Logger = require('../helpers/logger');

module.exports = {
    name: 'unban',
    description: 'Unban a user',
    async execute(message, args) {
        let user = args[1];

        message.guild.fetchBans().then(async users => {
            users.get(user);
            await message.guild.members.unban(user);
            let msg = `**${message.author.tag}** unbanned user **${user}**.`;
            message.channel.send(msg);
            Logger.embed(message,
                'Member Unbanned',
                msg,
                'ID - ' + user.id,
                message.author, config.colors.unbanned);
        }).catch(err => console.log(err));
    }
}