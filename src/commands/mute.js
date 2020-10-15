const Actions = require('../utils/Actions');
const Timer = require('../models/Timer');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'mute',
    description: 'Mute a user',
    execute(message, args) {
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get duration
        let duration = args[2];
        if(duration === '0') duration = 'forever';
        //Get reason
        let reason = args.slice(3).join(' ');
        //Check for command completion and self muting
        if (!reason) return message.reply('You forgot to enter a reason for this mute!');
        if(!duration) return message.reply('You forgot to enter a duration for this mute!');
        if (user === message.author) return message.channel.send('You can\'t mute yourself');

        //Check if timescale is correct
        try{
            Timer.parseTime(time);
        }catch(err) {
            message.reply(err);
            return;
        }
        
        let msg = `**${message.author.tag}** muted user **${user.tag}** for **${duration}** because: **${reason}**.`;
        if(Actions.mute(message, user, true, msg) === true)
            message.channel.send(msg);
        else return message.channel.send("Something went wrong.");

        //If duration is forever, dont add a timeout
        if(duration === 'forever') return;

        let t = new Timer();
        t.create(user, "unmute", Timer.parseTime(duration));
        t.save();
        t.start(message);
    }
}