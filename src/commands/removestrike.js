const config = require('../config.json');
const Logger = require('../helpers/logger');
const Strike = require('../objects/Strike');

module.exports = {
    name: 'removestrike',
    description: 'unstrike a user',
    async execute(message, args) {
        if(args.length !== 2) return message.reply("Wrong amount of arguments!");
        let strike = await Strike.getStrike(args[1]);
        if(strike.length === 0) return message.reply("Strike with ID **#"+args[1]+"** not found.");
        //strike the user
        let msg = `**${message.author.tag}** removed strike with ID: **${args[1]}**.`;
        if(await Strike.deleteStrike(args[1])) {
            message.channel.send(msg);
            Logger.embed(message, 'Strike Removed | **#'+ strike[0].prettyID +'**',
                msg, 'User ID - ' + strike[0].userID, message.author, config.colors.strikeremoved);
        }
    }
}