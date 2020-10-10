import profanities from '../../profanities.json';
import { Message } from 'discord.js';

export default class SwearFilter {

    static check(message: Message): string{
        if(!message.content || message.author.bot) return null;
        let args = message.content.split(' ');
        for(let i = 0; i < args.length; i++){
            for(let j = 0; j < profanities.words.length; j++){
                if(args[i].toLowerCase().includes(profanities.words[j])) return profanities.words[j];
            }
        }
        return null;
    }

}