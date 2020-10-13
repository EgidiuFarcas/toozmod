exports.getUser = (message) => {
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
};
exports.getChannel = (message) => {
    let args = message.content.split(' ');
    let channel = message.mentions.channels.first();
    if (!channel) {
        try {
            if (!message.guild.channels.cache.get(args[1]))
                throw new Error('Couldn\'t get a Discord channel with this id!');
            channel = message.guild.channels.cache.get(args[1]);
            return channel;
        } catch (error) {
            return null;
        }
    }else return channel;
};