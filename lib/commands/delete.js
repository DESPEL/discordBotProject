const hasRole = require('./../utils/hasRole');
const Discord = require('discord.js');

module.exports = async function (message, bot, amount) {
    if (hasRole(message, 'ok')) {
        if (!isNaN(amount)) {
            let times = 0;
            times = parseInt(amount / 100);
            amount = amount % 100;

            for (let i = 0; i < times; i++) {
                const fetched = await message.channel.fetchMessages({ limit: 100 });
                await message.channel.bulkDelete(fetched)
                    .catch(error => message.channel.send("Error: $(error)"));
            }

            const fetched = await message.channel.fetchMessages({ limit: amount });
            await message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send("Error: $(error)"));
            
            message.channel.send('Mensajes borrados con éxito:' + amount + ' mensajes');
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