const hasRole = require('./../utils/hasRole');
const Discord = require('discord.js');

module.exports = async function (message, ...args) {
    let amount = args[0];
    if (hasRole(message, 'ok')) {
        if (!isNaN(amount)) {
            const fetched = await message.channel.fetchMessages({ limit: amount });
            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send("Error: $(error)"));
        } else {
            const embed = new Discord.RichEmbed()
            .setColor('0xFF0000')
            .setTitle('Error')
            .setDescription('La cantidad de mensajes debe de ser un número');
            message.channel.send(embed);
        }
    } else {
        const embed = new Discord.RichEmbed()
            .setColor('0xFF0000')
            .setTitle('Error')
            .setDescription('Debes de tener el rol "ok" para eliminar mensajes');
        message.channel.send(embed);
    }

}

module.exports.description = "Te permite eliminar cierta cantidad de mensajes"
module.exports.args = "<amount>"
module.exports.rank = "ok"