const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'echo',
    description: 'Send A message as the bot',
    execute: async function (message, args) {
        let msg = args.slice(2).join(' ');
        let channel = MessageManager.getChannel(message);
        if (channel === null) return message.reply('Couldn\'t get a Discord channel with this ID!');
        
        if(channel.send(msg)){
            message.react("✅");
        }
    }
}