const Discord = require('discord.js');
const config = require('./../../../config.json');

module.exports = function (message, title = config.botName, text = ' ', modifier, ...args) {
    let embed = new Discord.RichEmbed()
    .setColor(config.botColor)
    .setTitle(title)
    .setDescription(text);
    if(typeof modifier == "function") {
        modifier(embed, ...args);
    }
    message.channel.send(embed);
}