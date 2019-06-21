const Discord = require('discord.js');
const config = require('./../../../config.json');

module.exports = async function (message, description) {
    let embed = new Discord.RichEmbed()
        .setColor(config.errorColor)
        .setTitle(config.errorTitle)
        .setDescription(description);
    await message.channel.send(embed);
    return;
}