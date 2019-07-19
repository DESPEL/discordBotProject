const Discord = require('discord.js');

module.exports.ban = async function (message, ...args) {
    let user = message.mentions.users.first();
    let razon = args.slice(1).join(' ');
    
        if (message.mentions.users.size < 1) return message.reply('Debes mencionar a alguien.').catch(console.error);
            if (!razon) return message.channel.send('Escriba una razón, `-ban @username [razón]`');
                if (!message.guild.member(user).bannable) return message.reply('No puedo banear al usuario mencionado.');

    message.guild.member(user).ban(razon);
    const embed = new Discord.RichEmbed()
    .setColor('0xFF0000')
    .setDescription(`**${user.username}**, fue baneado del servidor, razón: ${razon}.`);
    message.channel.send(embed);

}

module.exports.ban.description = "Te permite banear de forma permanente a un usuario de tu server."
module.exports.ban.args = "<@usuario> [Razón]"
module.exports.ban.rank = "ok"
module.exports.ban.cat = "utils";