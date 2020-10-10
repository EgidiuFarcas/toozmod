const config = require('../config.json');
const Logger = require('../helpers/logger');
const ChannelManager = require('../modules/ChannelManager');

module.exports = {
    name: 'echo',
    description: 'Send A message as the bot',
    execute: async function (message, args) {
        let msg = args.slice(2).join(' ');
        let channel = ChannelManager.getChannelFromCommand(message);
        if (channel === null) return message.reply('Couldn\'t get a Discord channel with this ID!');
        
        if(channel.send(msg)){
            message.react("✅");
        }
    }
}