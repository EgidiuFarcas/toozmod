const botConfig = require("./botconfig.json");
const config = require("./config.json");
const Logger = require("./helpers/logger");

const fs = require("fs");
const mongoose = require("mongoose");
const Discord = require("discord.js");
let Timer = require("./models/timer");
const TimeEvent = require('./objects/TimeEvent');

//Connect to mongoose db
const uri = "mongodb+srv://toozmod_node:zFzlSQFOUx3GKiNO@cluster0.ztzpe.mongodb.net/toozmod?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true } );

const client = new Discord.Client();
//Create commands collection
client.commands = new Discord.Collection();
//Get all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//Setup Commands
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", async () => {
    console.log(`${client.user.username} is now online.`);
    let ch = client.channels.cache.get(config.log_channel_id);
    let message = await ch.send('Back Online');
    let r = await Timer.find();
    let message2 = await message.channel.send(`Loading ${r.length} timed events. *Please wait...*`);
    await r.forEach((info) => {
        let t = new TimeEvent();
        t.load(info._id).then(() => t.start(message));
    });
    await message2.edit(`**Load Complete.**`);
});

client.login(botConfig.token).then();

client.on('message', async message => {
    //Check if its a command
    if(message.content.charAt(0) !== botConfig.prefix) return;
    //Get only the command arguments
    let args = message.content.substring(1).split(" ");

    if(args[0] === "test"){

    }
    if(args[0] === "ban") client.commands.get('ban').execute(message, args);
    if(args[0] === "unban") client.commands.get('unban').execute(message, args);
    if(args[0] === "tempban") client.commands.get('tempban').execute(message, args);
    if(args[0] === "mute") client.commands.get('mute').execute(message, args);
    if(args[0] === "unmute") client.commands.get('unmute').execute(message, args);
    if(args[0] === "blacklist") client.commands.get('imbl').execute(message, args);
    if(args[0] === "unblacklist") client.commands.get('unimbl').execute(message, args);
})