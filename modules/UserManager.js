exports.getUserFromCommand = (message) => {
    let args = message.content.split(' ');
    let user = message.mentions.users.first();
    if (!user) {
        try {
            if (!message.guild.members.cache.get(args[1]))
                throw new Error('Couldn\'t get a Discord user with this userID!');
            user = message.guild.members.cache.get(args[1]);
            user = user.user;
            return user;
        } catch (error) {
            return null;
        }
    }else return user;
}