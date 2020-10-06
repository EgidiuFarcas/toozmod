const config = require('../config.json');
const UserManager = require('../modules/UserManager');
const Actions = require('../helpers/actions');

module.exports = {
    name: 'strike',
    description: 'strike a user',
    async execute(message, args) {
        let reason = args.slice(2).join(' ');
        //Try to get user from command
        let user = UserManager.getUserFromCommand(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for command completion, self striking or rank bypassing
        if (!reason) return message.reply('You forgot to enter a reason for this strike!');
        if (user === message.author) return message.channel.send('You can\'t strike yourself');
        //strike the user
        let msg = `**${message.author.tag}** struck user **${user.tag}** because: *${reason}*.`;
        if(await Actions.strike(message, user, true, msg, reason) === true)
            message.channel.send(msg);
    }
}