const Discord = require('discord.js');
const botName = require('./../../config.json').botname;
let commandHandler = require('./../commandHandler');

module.exports = function(message) {
    let commands = commandHandler.commands
    let embed = new Discord.RichEmbed()
        .setColor('0x42a7f4')
        .setTitle('Comandos del bot: ' + botName);
    for(let key in commands) {
        let commandStr = ';' + key + ' ' + commands[key].args;
        let descriptionStr = commands[key].description;
        if (!commands[key].args) {
            continue;
        }
        if (!descriptionStr) {
            let noDescStr = 'No hay descripción del comando';
            embed.addField(commandStr, noDescStr);
            continue;
        }
        embed.addField(commandStr, descriptionStr);
    }
    message.channel.send(embed);
}