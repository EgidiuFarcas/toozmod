const config = require('../config.json');
const Logger = require('../utils/Logger');

module.exports = {
    name: 'log',
    description: 'Send A custom log',
    execute: async function (message, args) {
        let msg = args.slice(1).join(' ');
        Logger.embed(message, 'Manual Log',
            msg, 'Custom Log', message.author, config.colors.customlog);
        await message.react("✅");
    }
}