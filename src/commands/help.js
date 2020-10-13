const Discord = require("discord.js");
const config = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Shows help menu',
    async execute(message, args) {
        const emb = new Discord.MessageEmbed()
            .setColor('0x' + config.colors.helpmenu)
            .setTitle(`Help menu`)
            .addField('`' + process.env.PREFIX + 'strike [@user or ID] [Reason] `', "Strikes an user")
            .addField('`' + process.env.PREFIX + 'removestrike [strike ID] `', "Removes a strike")
            .addField('`' + process.env.PREFIX + 'strikes [@user or ID] `', "Shows user's strikes")
            .addField('`' + process.env.PREFIX + 'ban [@user or ID] [Reason] `', "Bans a user permanently")
            .addField('`' + process.env.PREFIX + 'tempban [@user or ID] [duration(s/m/h/d)] [Reason] `', "Bans a user temporarely")
            .addField('`' + process.env.PREFIX + 'mute [@user or ID] [duration(s/m/h/d)] [Reason] `', "Mutes a user temporarily (duration 0 for perma mute)")
            .addField('`' + process.env.PREFIX + 'unmute [@user or ID] `', "Unmutes a user")
            .addField('`' + process.env.PREFIX + 'blacklist [@user or ID] [duration(s/m/h/d)] [Reason] `', "Image Blacklists a user temporarily (duration 0 for perma blacklist)")
            .addField('`' + process.env.PREFIX + 'unblacklist [@user or ID] `', "Unblacklists a user")
            .addField('`' + process.env.PREFIX + 'log [text] `', "Sends a custom log message in the log channel.")
            .addField('`' + process.env.PREFIX + 'echo [#channel or ID] [text] `', "Sends a message in the channel as the bot.")
        await message.channel.send(emb);
        await message.react("✅");
    }
}