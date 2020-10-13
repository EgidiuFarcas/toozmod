exports.addRole = (message, role_id, user_id) => {
    let role = message.guild.roles.cache.find(r => r.id === role_id);
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
exports.removeRole = (message, role_id, user_id, reply = true) => {
    let member = message.guild.members.cache.get(user_id);
    let role = message.guild.roles.cache.find(r => r.id === role_id);
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