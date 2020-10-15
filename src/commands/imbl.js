const Actions = require('../utils/Actions');
const Timer = require('../models/Timer');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'imbl',
    description: 'Blacklist a user',
    execute(message, args) {
        //Try to get user from command
        let user = MessageManager.getUser(message);
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

        //Check if timescale is correct
        try{
            Timer.parseTime(time);
        }catch(err) {
            message.reply(err);
            return;
        }

        let msg = `**${message.author.tag}** blacklisted user **${user.tag}** for **${time}** because: **${reason}**.`;
        if(Actions.blacklist(message, user, true, msg) === true)
            message.channel.send(msg);
        else return message.channel.send("Something went wrong.");

        //If duration is forever, don't add a timeout
        if(time === 'forever') return;

        let t = new Timer();
        t.create(user, "unblacklist", Timer.parseTime(time));
        t.save();
        t.start(message);
    }
}