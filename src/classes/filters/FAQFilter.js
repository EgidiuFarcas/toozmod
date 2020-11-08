const Discord = require('discord.js');
let config = require("../../config.json");

class FAQFilter {

    /**
     * @param {Discord.Message} message 
     */
    static async filter(message){
        config = require("../../config.json");
        //Check if message was sent in faq channel
        if(message.channel.id !== config.channels.faq.id) return null;
        let check = this.check(message);
        if(check === null) return null;
        message.reply(check);
        return 'break';
    }

    /**
     * @param {Discord.Message} message 
     */
    static check(message){
        if(!message.content || message.author.bot) return null;

        for(let i = 0; i < config.faq.length; i++){
            let fit = 0;
            for(let j = 0; j < config.faq[i].keywords.length; j++){
                let content = message.content.toLowerCase();
                let keyword = config.faq[i].keywords[j].toLowerCase();
                if(content.includes(keyword)) fit++;
            }
            let fitness = (fit / config.faq[i].keywords.length) * 100;
            if(fitness >= 75) return config.faq[i].answer;
        }
        return null;
    }

}

module.exports = FAQFilter;