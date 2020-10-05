const config = require('../config.json');
const Logger = require('../helpers/logger');
const RoleManager = require('../modules/RoleManager');
const UserManager = require('../modules/UserManager');

exports.ban = (message, user, log=false, log_txt = "", reason = "Automated Action") => {
    message.guild.member(user).ban({reason: reason}).then(()=>{
        if(log)
            Logger.embed(message, 'Member Banned', log_txt,'ID - ' + user.id, message.author, config.colors.banned);
        return true;
    }).catch(err => {
        return false;
    });
};

exports.mute = (message, user, log=false, log_txt = "", author = message.author) => {
    //Try to add role
    if(RoleManager.addRole(message, config.muted_role_name, user.id) === false) return false;
    if(log)
        Logger.embed(message, 'Member Muted', log_txt, 'ID - ' + user.id, author, config.colors.muted);
    return true;
};

exports.blacklist = (message, user, log=false, log_txt = "", author = message.author) => {
    //Try to add role
    if(RoleManager.addRole(message, config.imbl_role_name, user.id) === false) return false;
    if(log)
        Logger.embed(message, 'Member Blacklisted', log_txt, 'ID - ' + user.id, author, config.colors.blacklisted);
    return true;
};

/* UN ACTIONS */

exports.unban = (message, user, log=false, log_txt = "", author = message.author) => {
    let arg1 = message.content.split(' ')[1];
    user = arg1;
    //Look through bans
    message.guild.fetchBans().then(async users => {
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
        console.log(err);
        return false;
    });
};

exports.unmute = (message, user, log=false, log_txt = "", author = message.author) => {
    if(RoleManager.removeRole(message, config.muted_role_name, user.id) === false)
        return false;
    if(log)
        Logger.embed(message, 'Member Unmuted', log_txt, 'ID - ' + user.id, author, config.colors.unmuted);
    return true;
};

exports.unblacklist = (message, user, log=false, log_txt = "", author = message.author) => {
    if(RoleManager.removeRole(message, config.imbl_role_name, user.id) === false)
       return false;
    if(log)
        Logger.embed(message, 'Member Unblacklisted', log_txt, 'ID - ' + user.id, author, config.colors.unblacklisted);
    return true;
};