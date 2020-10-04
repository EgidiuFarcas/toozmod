const Discord = require("discord.js");
const config = require("../config.json");

exports.embed = (message, title, description, footer, author = message.author, color = '0099ff') => {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('0x' + color)
        .setTitle(title)
        .setAuthor(author.username, author.avatarURL())
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer);

    let channel = message.guild.channels.cache.find(c => c.name === config.log_channel_name);
    if(channel) channel.send(exampleEmbed);
};

exports.plain = (message, text) => {
    let channel = message.guild.channels.cache.find(c => c.name === config.log_channel_name);
    let d = new Date();
    if(channel) channel.send(text + " || *" + d.toLocaleString() + '*');
}