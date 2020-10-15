const Actions = require('../utils/Actions');
const Timer = require('../models/Timer');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'tempban',
    description: 'Temp Ban a user',
    async execute(message, args) {
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get duration
        let duration = args[2];
        //Get reason
        let banReason = args.slice(3).join(' ');
        //Check for command completion, self banning and over ranking
        if (user === message.author) return message.channel.send('You can\'t ban yourself');
        if (!banReason) return message.reply('You forgot to enter a reason for this ban!');
        if (!message.guild.member(user).bannable) return message.reply('You can\'t ban this user because you the bot has not sufficient permissions!');

        //Check if timescale is correct
        try{
            Timer.parseTime(time);
        }catch(err) {
            message.reply(err);
            return;
        }

        let msg = `**${message.author.tag}** banned user **${user.tag}** for **${duration}** because: **${banReason}**.`;
        if(Actions.ban(message, user, true, msg, banReason) === true)
            message.channel.send(msg);

        let t = new Timer();
        t.create(user, "unban", Timer.parseTime(duration));
        t.save();
        t.start(message);
    }
}