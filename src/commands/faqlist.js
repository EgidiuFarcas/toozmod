const Discord = require("discord.js");
const JSONEdit = require('../utils/JSONEdit');

module.exports = {
    name: 'faqlist',
    description: 'List faqs',
    async execute(message, args) {
        let config = require("../config.json");
        let faqs = config.faq;


        const emb = new Discord.MessageEmbed()
        .setColor('0x' + config.colors.faqlist)
        .setTitle(`Frequently Asked Questions`);

        for(let i = 0; i < faqs.length; i++){
            emb.addField('#' + faqs[i].id + " | kw: " + faqs[i].keywords.toString(), "Reply: " + faqs[i].answer);
        }
        await message.channel.send(emb);
        await message.react("✅");

        return;
    }
}