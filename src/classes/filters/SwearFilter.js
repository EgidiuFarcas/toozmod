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