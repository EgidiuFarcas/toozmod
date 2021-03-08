const profanities = require('../../config.json').profanities;
const Actions = require('../../utils/Actions');

class SwearFilter {

    /**
     * @param {Discord.Message} message 
     */
    static async filter(message){
        let filterCheck = this.check(message);
        if(filterCheck !== false){
            await Actions.strike(message, message.author, true, `${message.author.tag} used a blacklisted word.`,
                'Automated Action (blacklisted word: '+filterCheck +')');
            
                let strike_count = await Strike.getStrikeCount(user.id);
                if(strike_count === 2){
                    Actions.ban(message, user, true, `**${user.tag}** banned for 7 days because: 2 strikes`, 'Accumulated 3 Strikes - Automated Action');
                    let t = new Timer();
                    t.create(user, "unban", Timer.parseTime("7d"));
                    t.save();
                    t.start(message);
                }
                if(strike_count >= 3){
                    Actions.ban(message, user, true, `**${user.tag}** banned permanently because: 3 or more strikes`, 'Accumulated 3 or more Strikes - Automated Action');
                }

            let t = new Timer();
            t.create(message.author, "unmute", Timer.parseTime("6h"));
            t.save();
            t.start(message);

            await message.delete();
            return 'fail';
        }
        return 'pass';
    }

    /**
     * @param {Discord.Message} message 
     */
    static check(message){
        if(!message.content || message.author.bot) return false;
        let args = message.content.split(' ');
        for(let i = 0; i < args.length; i++){
            for(let j = 0; j < profanities.words.length; j++){
                if(args[i].toLowerCase() === profanities.words[j]) return profanities.words[j];
            }
        }
        return false;
    }

}

module.exports = SwearFilter;