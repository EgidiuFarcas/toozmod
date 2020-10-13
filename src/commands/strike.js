const Actions = require('../utils/Actions');
const Strike = require('../models/Strike');
const Timer = require('../models/Timer');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'strike',
    description: 'strike a user',
    async execute(message, args) {
        let reason = args.slice(2).join(' ');
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Check for command completion, self striking or rank bypassing
        if (!reason) return message.reply('You forgot to enter a reason for this strike!');
        if (user === message.author) return message.channel.send('You can\'t strike yourself');
        //strike the user
        let msg = `**${message.author.tag}** struck user **${user.tag}** because: *${reason}*.`;
        if(await Actions.strike(message, user, true, msg, reason) === true)
            message.channel.send(msg);

        let strike_count = await Strike.getStrikeCount(user.id);
        if(strike_count === 3){
            Actions.ban(message, user, true, `**${user.tag}** banned for 30 days because: 3 strikes`, 'Accumulated 3 Strikes - Automated Action');
            let t = new Timer();
            t.create(user, "unban", Timer.parseTime("30d"));
            t.save();
            t.start(message);
        }
        if(strike_count > 3){
            Actions.ban(message, user, true, `**${user.tag}** banned permanently because: more than 3 strikes`, 'Accumulated more than 3 Strikes - Automated Action');
        }
    }
}