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

    let channel = message.guild.channels.cache.get(config.channels.log.id);
    if(channel) channel.send(exampleEmbed);
    else console.log("Log channel not found");
};

exports.embedClient = (client, title, description, footer, author = message.author, color = '0099ff') => {
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('0x' + color)
        .setTitle(title)
        .setAuthor(author.username, author.avatarURL())
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer);

    let channel = client.channels.cache.get(config.channels.log.id);
    if(channel) channel.send(exampleEmbed);
    else console.log("Log channel not found");
};

exports.plain = (message, text) => {
    let channel = message.guild.channels.cache.get(config.channels.log.id);
    let d = new Date();
    if(channel) channel.send(text + " || *" + d.toLocaleString() + '*');
    else console.log("Log channel not found");
}