//Include packages
const Discord = require('discord.js');
const mongoose = require('mongoose');
//Include config
const config = require('./config.json');
require('dotenv').config();
//Include utils
const Logger = require('./utils/Logger');
//const Actions = require('./utils/Actions');
const CommandLoader = require('./utils/CommandLoader');
//Include Models
const Timer = require('./models/Timer');
//Include Clases
const SwearFilter = require('./classes/filters/SwearFilter');
const PingFilter = require('./classes/filters/PingFilter');

//Connect to database
mongoose.connect(process.env.DATABASE_URI,
    { useNewUrlParser: true, useUnifiedTopology: true}, () => console.log('Connected to DB'));

//Create client
const client = new Discord.Client();
client.commands = CommandLoader.load();

//On client ready
client.once('ready', async () => {
    console.log(`${client.user.username} is now online.`);
    //Get log channel
    let logChannel = client.channels.cache.get(config.channels.log.id);
    if(!logChannel) console.log("Log channel not found.");
    //Send back online message
    let message = await logChannel.send('Back Online').catch(err => console.log(err));
    message = await logChannel.send('Loading timers from database.* Please wait...*').catch(err => console.log(err));
    Timer.loadPendingTimers(message);
    await message.edit("**Load Complete.**").catch(err => console.log(err));
});

//On new message
client.on('message', async message => {
    //Split message into arguments
    let args = message.content.substring(1).split(" ");

    //Apply Filters
    if(await SwearFilter.filter(message) === 'fail') return;
    if(await PingFilter.filter(message) === 'fail') return;

    //Check if its a command
    if(message.content.charAt(0) !== process.env.PREFIX) return;

    //Execute code under this only if user has necessary permissions
    if(!message.member.roles.cache.has(config.roles.access.id) &&
        !message.member.permissions.has("MANAGE_GUILD")) return;

    //Check command execution
    if(args[0] === "help") client.commands.get('help').execute(message, args);
    if(args[0] === "ban") client.commands.get('ban').execute(message, args);
    if(args[0] === "unban") client.commands.get('unban').execute(message, args);
    if(args[0] === "tempban") client.commands.get('tempban').execute(message, args);
    if(args[0] === "mute") client.commands.get('mute').execute(message, args);
    if(args[0] === "unmute") client.commands.get('unmute').execute(message, args);
    if(args[0] === "blacklist") client.commands.get('imbl').execute(message, args);
    if(args[0] === "unblacklist") client.commands.get('unimbl').execute(message, args);
    if(args[0] === "strike") client.commands.get('strike').execute(message, args);
    if(args[0] === "strikes") client.commands.get('strikes').execute(message, args);
    if(args[0] === "removestrike") client.commands.get('removestrike').execute(message, args);
    if(args[0] === "log") client.commands.get('log').execute(message, args);
    if(args[0] === "echo") client.commands.get('echo').execute(message, args);
});

//On channel changes
client.on('channelUpdate', async (oldChannel, newChannel) => {
    if(oldChannel.type !== "text") return;

    let oldRateLimit = oldChannel.rateLimitPerUser;
    let newRateLimit = newChannel.rateLimitPerUser;

    if(oldRateLimit !== newRateLimit) Logger.embedClient(client,
        "Channel Updated",
        "Channel " + client.channels.cache.get(oldChannel.id).toString() + " rate limit change. **" + oldRateLimit + "s** => **" + newRateLimit + "s**",
        "Channel Update", client.user, config.colors.helpmenu);
});

client.login(process.env.BOT_TOKEN).then().catch(err => console.log(err));