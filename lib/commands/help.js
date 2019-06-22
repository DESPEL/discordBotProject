const Discord = require('discord.js');
const botName = require('./../../config.json').botname;
let commands = require('./../commands');

let noDescriptionSTR = 'No hay descripción del comando';

module.exports = function(message) {
    //console.log(commands);
    let embed = new Discord.RichEmbed()
        .setColor('0x42a7f4')
        .setTitle('Comandos del bot: ' + botName);
    addCommand(embed, commands);
    message.channel.send(embed);
}

function addCommand(embed, commands) {
    for(let key in commands) {
        console.log(commands[key]);
        if(typeof commands[key] == 'function') {
            let commandSTR = ';' + key + ' ' + (commands[key].args ? commands[key].args + ' ' : ' ');
            let descriptionSTR = commands[key].description ? commands[key].description : noDescriptionSTR;
            embed.addField(commandSTR, descriptionSTR);
        }
    }
}