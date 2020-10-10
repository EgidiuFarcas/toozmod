const Discord = require("discord.js");
const config = require('../config.json');
const botconfig = require('../botconfig.json');

module.exports = {
    name: 'help',
    description: 'Shows help menu',
    async execute(message, args) {
        const emb = new Discord.MessageEmbed()
            .setColor('0x' + config.colors.helpmenu)
            .setTitle(`Help menu`)
            .addField('`' + botconfig.prefix + 'strike [@user or ID] [Reason] `', "Strikes an user")
            .addField('`' + botconfig.prefix + 'removestrike [strike ID] `', "Removes a strike")
            .addField('`' + botconfig.prefix + 'strikes [@user or ID] `', "Shows user's strikes")
            .addField('`' + botconfig.prefix + 'ban [@user or ID] [Reason] `', "Bans a user permanently")
            .addField('`' + botconfig.prefix + 'tempban [@user or ID] [duration(s/m/h/d)] [Reason] `', "Bans a user temporarely")
            .addField('`' + botconfig.prefix + 'mute [@user or ID] [duration(s/m/h/d)] [Reason] `', "Mutes a user temporarily (duration 0 for perma mute)")
            .addField('`' + botconfig.prefix + 'unmute [@user or ID] `', "Unmutes a user")
            .addField('`' + botconfig.prefix + 'blacklist [@user or ID] [duration(s/m/h/d)] [Reason] `', "Image Blacklists a user temporarily (duration 0 for perma blacklist)")
            .addField('`' + botconfig.prefix + 'unblacklist [@user or ID] `', "Unblacklists a user")
            .addField('`' + botconfig.prefix + 'log [text] `', "Sends a custom log message in the log channel.")
        await message.channel.send(emb);
        await message.react("✅");
    }
}