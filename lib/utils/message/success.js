const Discord = require('discord.js');
const config = require('./../../../config.json');

module.exports = async function (message, description, title = config.successTitle) {
    let embed = new Discord.RichEmbed()
        .setColor(config.successColor)
        .setTitle(title)
        .setDescription(description);
    await message.channel.send(embed);
    return;
}