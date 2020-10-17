const config = require('../config.json');
const Discord = require("discord.js");
const Strike = require('../models/Strike');

module.exports = {
    name: 'mystrikes',
    description: 'Get user strikes',
    async execute(message, args) {
        //Try to get user from command
        let user = message.author;
        if (user === null) return message.author.send('Couldn\'t get a Discord user!');
        
        //Get the strikes
        let strikes = await Strike.getStrikes(user.id);
        //If the user has no strikes
        if(strikes.length === 0){
            return message.author.send(`You have no strikes.`);
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
        await message.author.send(emb);
        message.react("✅");
    }
}