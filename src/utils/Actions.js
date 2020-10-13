const config = require('../config.json');
const Logger = require('../utils/Logger');
const Strike = require('../models/Strike');
const RoleManager = require('../classes/managers/RoleManager');

exports.ban = (message, user, log=false, log_txt = "", reason = "Automated Action") => {
    message.guild.member(user).ban({reason: reason}).then(()=>{
        if(log)
            Logger.embed(message, 'Member Banned', log_txt,'ID - ' + user.id, message.author, config.colors.banned);
        return true;
    }).catch(err => {
        return false;
    });
};

exports.strike = async (message, user, log=false, log_txt = "", reason = "Automated Action") => {
    let strike = new Strike(user, reason);
    await strike.save();
    let strike_count = await Strike.getStrikeCount(user.id);
    message.channel.send(log_txt + ` __${user.username}__ now has ***${strike_count} ` + ((strike_count > 1) ? 'strikes' : 'strike') + `***.`);
    if(log)
        Logger.embed(message, 'Member Struck | **#'+ strike.prettyID +'**',
            log_txt, 'ID - ' + user.id, message.author, config.colors.strike.struck);
};

exports.mute = (message, user, log=false, log_txt = "", author = message.author) => {
    //Try to add role
    if(RoleManager.addRole(message, config.roles.muted.id, user.id) === false) return false;
    if(log)
        Logger.embed(message, 'Member Muted', log_txt, 'ID - ' + user.id, author, config.colors.muted);
    return true;
};

exports.blacklist = (message, user, log=false, log_txt = "", author = message.author) => {
    //Try to add role
    if(RoleManager.addRole(message, config.roles.blacklisted.id, user.id) === false) return false;
    if(log)
        Logger.embed(message, 'Member Blacklisted', log_txt, 'ID - ' + user.id, author, config.colors.blacklisted);
    return true;
};

/* UN ACTIONS */

exports.unban = async (message, user, log=false, log_txt = "", author = message.author) => {
    let arg1;
    if(user === null) {
        arg1 = message.content.split(' ')[1];
        user = arg1;
    }
    //Look through bans
    await message.guild.fetchBans().then(async users => {
        //Check if the user is banned
        let usr = users.get(user);
        if(!usr) return false;
        //Unban the user
        await message.guild.members.unban(user);
        //Message chat and log
        if(log)
            Logger.embed(message, 'Member Unbanned', log_txt, 'ID - ' + arg1, author, config.colors.unbanned);
        return true;
    //Catch any errors
    }).catch(err => {
        if(err){
            console.log(err);
            return false;
        }
    });
    return true;
};

exports.unmute = (message, user, log=false, log_txt = "", author = message.author) => {
    if(RoleManager.removeRole(message, config.roles.muted.id, user.id) === false)
        return false;
    if(log)
        Logger.embed(message, 'Member Unmuted', log_txt, 'ID - ' + user.id, author, config.colors.unmuted);
    return true;
};

exports.unblacklist = (message, user, log=false, log_txt = "", author = message.author) => {
    if(RoleManager.removeRole(message, config.roles.blacklisted.id, user.id) === false)
       return false;
    if(log)
        Logger.embed(message, 'Member Unblacklisted', log_txt, 'ID - ' + user.id, author, config.colors.unblacklisted);
    return true;
};