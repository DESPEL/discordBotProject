const Discord = require('discord.js');

module.exports.kick = async function (message, ...args) {
    let user = message.mentions.users.first();
    let razon = args.slice(1).join(' ');
    
        if (message.mentions.users.size < 1) return message.reply('Debes mencionar a alguien.').catch(console.error);
            if (!razon) return message.channel.send('Escriba una razón, `-kick @username [razón]`');
                if (!message.guild.member(user).kickable) return message.reply('No puedo kickear al usuario mencionado.');
     
    message.guild.member(user).kick(razon);
    const embed = new Discord.RichEmbed()
    .setColor('0xFF0000')
    .setDescription(`**${user.username}**, fue kickeado del servidor, razón: ${razon}.`);
    message.channel.send(embed);

}

module.exports.kick.description = "Te permite kickear o echar a un usuario de tu server."
module.exports.kick.args = "<@usuario> [Razón]"
module.exports.kick.rank = "ok"
module.exports.kick.cat = "utils";