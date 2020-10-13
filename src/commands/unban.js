const Actions = require('../utils/Actions');

module.exports = {
    name: 'unban',
    description: 'Unban a user',
    async execute(message, args) {
        let msg = `**${message.author.tag}** unbanned user **${args[1]}**.`;
        if(Actions.unban(message, null, true, msg) === true)
            message.channel.send(msg);
    }
}