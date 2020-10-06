const profanities = require('../profanities.json');

class SwearFilter {

    static check(message){
        if(!message.content || message.author.bot) return false;
        let args = message.content.split(' ');
        for(let i = 0; i < args.length; i++){
            for(let j = 0; j < profanities.words.length; j++){
                if(args[i].toLowerCase().includes(profanities.words[j])) return profanities.words[j];
            }
        }
        return false;
    }

}

module.exports = SwearFilter;