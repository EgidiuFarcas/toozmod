const Discord = require('discord.js');
const fs = require('fs');

function load() {
    //Create commands collection
    let commands = new Discord.Collection();
    //Get all command files
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    //Setup Commands
    for(const file of commandFiles){
        const command = require(`../commands/${file}`);
        commands.set(command.name, command);
    }
    return commands;
}

module.exports.load = load;