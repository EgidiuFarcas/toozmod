exports.addRole = (message, role_name, user_id) => {
    let role = message.guild.roles.cache.find(r => r.name === role_name);
    if(!role){
        message.reply(role_name + ' role doesn\'t exist!');
        return false;
    }
    try {
        message.guild.members.cache.get(user_id).roles.add(role);
    }catch (err) {
        console.log(err);
        return false;
    }
    return true;
};
exports.removeRole = (message, role_name, user_id) => {
    let member = message.guild.members.cache.get(user_id);
    let role = message.guild.roles.cache.find(r => r.name === role_name);
    if(!member){
        message.reply('Member not found!');
        return false;
    }
    if(!role){
        message.reply(role_name + ' role doesn\'t exist!');
        return false;
    }
    if(member.roles.cache.has(role.id)) member.roles.remove(role).catch(err => console.log(err));
    else return false;
    return true;
};