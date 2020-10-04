const config = require('../config.json');
const Logger = require('../helpers/logger');

module.exports = {
    name: 'unban',
    description: 'Unban a user',
    async execute(message, args) {
        let user = args[1];
        //Look through bans
        message.guild.fetchBans().then(async users => {
            //Check if the user is banned
            let usr = users.get(user);
            if(!usr) return;
            //Unban the user
            await message.guild.members.unban(user);
            //Message chat and log
            let msg = `**${message.author.tag}** unbanned user **${user}**.`;
            message.channel.send(msg);
            Logger.embed(message, 'Member Unbanned', msg, 'ID - ' + user.id, message.author, config.colors.unbanned);
        //Catch any errors
        }).catch(err => console.log(err));
    }
}