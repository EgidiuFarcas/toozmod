exports.getChannelFromCommand = (message) => {
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
}