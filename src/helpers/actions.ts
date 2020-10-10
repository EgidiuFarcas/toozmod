import config from '../../config.json';
import { Message, User } from 'discord.js';
import RoleTools from '../utils/RoleTools';
import Strike from '../classes/Strike';
import Logger from '../helpers/logger';

export default class Actions {

    public static async ban(message: Message, user: User, log: boolean = false, logText?: string, reason: string = "Automated Action"): Promise<boolean> {
        await message.guild.member(user).ban({reason: reason}).then(()=>{
            if(log)
                Logger.embed(message, 'Member Banned', logText,'ID - ' + user.id, message.author, config.colors.banned);
            return true;
        }).catch(err => {
            console.log(err);
            return false;
        });
        return false;
    }

    public static async strike(message: Message, user: User, log:boolean = false, logText?: string, reason: string = "Automated Action"): Promise<boolean> {
        let strike = new Strike(user, reason);
        await strike.save();
        let strike_count = await Strike.getStrikeCount(user.id);
        message.channel.send(logText + ` __${user.username}__ now has ***${strike_count} ` + ((strike_count > 1) ? 'strikes' : 'strike') + `***.`);
        if(log)
            Logger.embed(message, 'Member Struck | **#'+ strike.prettyID +'**',
                logText, 'ID - ' + user.id, message.author, config.colors.struck);
        return true;
    }

    public static async mute(message: Message, user: User, log: boolean = false, logText?: string, author: User = message.author): Promise<boolean> {
        //Try to add role
        if(RoleTools.add(message, config.muted_role_name, user.id) === false) return false;
        if(log)
            Logger.embed(message, 'Member Muted', logText, 'ID - ' + user.id, author, config.colors.muted);
        return true;
    }

    public static async blacklist(message: Message, user: User, log: boolean = false, logText?: string, author: User = message.author): Promise<boolean> {
        //Try to add role
        if(RoleTools.add(message, config.imbl_role_name, user.id) === false) return false;
        if(log)
            Logger.embed(message, 'Member Blacklisted', logText, 'ID - ' + user.id, author, config.colors.blacklisted);
        return true;
    }

    public static async unbanUser(message: Message, user: User, log: boolean = false, logText?: string, author: User = message.author){
        //Look through bans
        message.guild.fetchBans().then(async users => {
            //Check if the user is banned
            let usr = users.get(user.id);
            if(!usr) return false;
            //Unban the user
            await message.guild.members.unban(user);
            //Message chat and log
            if(log)
                Logger.embed(message, 'Member Unbanned', logText, 'ID - ' + user.id, author, config.colors.unbanned);
            return true;
        //Catch any errors
        }).catch(err => {
            console.log(err);
            return false;
        });
    }

    public static async unbanID(message: Message, user: string, log: boolean = false, logText?: string, author: User = message.author){
         //Look through bans
         message.guild.fetchBans().then(async users => {
            //Check if the user is banned
            let usr = users.get(user);
            if(!usr) return false;
            //Unban the user
            await message.guild.members.unban(user);
            //Message chat and log
            if(log)
                Logger.embed(message, 'Member Unbanned', logText, 'ID - ' + user, author, config.colors.unbanned);
            return true;
        //Catch any errors
        }).catch(err => {
            console.log(err);
            return false;
        });
    }

    public static async unmute(message: Message, user: User, log: boolean = false, logText?: string, author: User = message.author): Promise<boolean> {
        if(RoleTools.remove(message, config.muted_role_name, user.id) === false)
            return false;
        if(log)
            Logger.embed(message, 'Member Unmuted', logText, 'ID - ' + user.id, author, config.colors.unmuted);
        return true;
    };
    
    public static async unblacklist(message: Message, user: User, log: boolean = false, logText?: string, author: User = message.author): Promise<boolean> {
        if(RoleTools.remove(message, config.imbl_role_name, user.id) === false)
           return false;
        if(log)
            Logger.embed(message, 'Member Unblacklisted', logText, 'ID - ' + user.id, author, config.colors.unblacklisted);
        return true;
    };
}