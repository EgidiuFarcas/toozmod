const Discord = require('discord.js');
const config = require("../../config.json");
const Timer = require("../../models/Timer");
const Actions = require('../../utils/Actions');

class PingFilter {

    /**
     * @param {Discord.Message} message 
     */
    static async filter(message){
        let filterCheck = this.check(message);
        if(filterCheck !== false){
            await Actions.strike(message, message.author, true, `${message.author.tag} pinged a partner.`,
                'Automated Action (Pinged a partner)');
            Actions.mute(message, message.author, true, `${message.author.tag} pinged a partner. Muted for 1 hour.`, message.client.user);
            
            let t = new Timer();
            t.create(message.author, "unmute", Timer.parseTime("1h"));
            t.save();
            t.start(message);
            
            await message.delete();
            return 'fail';
        }else return 'pass';
    }

    /**
     * @param {Discord.Message} message 
     */
    static check(message){
        if(!message.content || message.author.bot) return false;
        if(message.member.roles.cache.has(config.roles.partner.id)) return false;
        if(message.member.hasPermission("MANAGE_MESSAGES")) return false;

        let mentions = message.mentions.members.array();
        for(let i = 0; i < mentions.length; i++){
            for(let j = 0; j < config.roles.unpingable.length; j++){
                if(mentions[i].roles.cache.has(config.roles.unpingable[j].id)) return true;
            }
        }
        return false;
    }

}

module.exports = PingFilter;