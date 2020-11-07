const Discord = require("discord.js");
const JSONEdit = require('../utils/JSONEdit');
const config = require('../config.json');
const Logger = require('../utils/Logger');

module.exports = {
    name: 'faqadd',
    description: 'Add a faq',
    async execute(message, args) {
        if(!args.includes('|') || args.lastIndexOf('|') === args.length-1) return message.reply("You forgot to enter a response.");
        let keywords = [];
        for(let i = 1; i < args.length; i++){
            if(args[i] === '|') break;
            keywords.push(args[i]);
        }
        let response = message.content.split(' | ')[1];
        let faq = await JSONEdit.addFAQ(keywords, response);

        const emb = new Discord.MessageEmbed()
        .setColor('0x' + config.colors.faqlist)
        .setTitle(`Added FAQ`)
        .addField('#' + faq.id + " | kw: " + faq.keywords.toString(), "Reply: " + faq.answer);
        await message.channel.send(emb);
        await message.react("✅");
        Logger.embed(message, 'Added FAQ', '#' + faq.id + " | kw: " + faq.keywords.toString() + " | reply: " + faq.answer,'ID - ' + message.author.id, message.author, config.colors.faq.added);
        return;
    }
}