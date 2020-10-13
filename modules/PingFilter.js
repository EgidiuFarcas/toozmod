const config = require("../config.json");
const Discord = require('discord.js');

class PingFilter {

    /**
     * 
     * @param {Discord.Message} message 
     */
    static check(message){
        if(!message.content || message.author.bot) return false;
        if(message.member.roles.cache.has(config.partner_role_id)) return false;
        if(message.member.hasPermission("MANAGE_MESSAGES")) return false;

        let mentions = message.mentions.members.array();
        for(let i = 0; i < mentions.length; i++){
            if(mentions[i].roles.cache.has(config.partner_role_id)) return true;
        }
        return false;
    }

}

module.exports = PingFilter;