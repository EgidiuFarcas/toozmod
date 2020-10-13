const config = require('../config.json');
const Discord = require("discord.js");
const Strike = require('../models/Strike');
const MessageManager = require('../classes/managers/MessageManager');

module.exports = {
    name: 'strikes',
    description: 'Get user strikes',
    async execute(message, args) {
        //Try to get user from command
        let user = MessageManager.getUser(message);
        if (user === null) return message.reply('Couldn\'t get a Discord user with this userID!');
        //Get the strikes
        let strikes = await Strike.getStrikes(user.id);
        //If the user has no strikes
        if(strikes.length === 0){
            return message.reply(`${user.tag} has no strikes.`);
        }
        //If the user has strikes
        const emb = new Discord.MessageEmbed()
            .setColor('0x' + config.colors.strike.check)
            .setTitle(`${user.username}'s strikes`)
            .setTimestamp()
            .setFooter('ID - ' + user.id);

        for(let i = 0; i < strikes.length; i++){
            emb.addField(`**#${strikes[i].prettyID}**`, strikes[i].reason, true);
        }
        await message.channel.send(emb);
    }
}