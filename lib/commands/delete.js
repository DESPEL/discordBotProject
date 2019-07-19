const hasRole = require('./../utils/hasRole');
const utils = require('./../utils');
const Discord = require('discord.js');

let maxAmount = 1000;

const exceedMaxAmount = 'No está permitido borrar más de ' + maxAmount + ' mensajes';

module.exports.delete = async function (message, bot, amount) {
    if (!isNaN(amount)) {
        if (amount > maxAmount) {
            utils.message.error(message, exceedMaxAmount);
            return;
        }
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

        message.channel.send('Mensajes borrados con éxito: ' + amount + ' mensajes');
    } else {
        const embed = new Discord.RichEmbed()
            .setColor('0xFF0000')
            .setTitle('Error')
            .setDescription('La cantidad de mensajes debe de ser un número');
        message.channel.send(embed);
    }
}

module.exports.delete.description = "Te permite eliminar cierta cantidad de mensajes"
module.exports.delete.args = "<amount>"
module.exports.delete.rank = "ok"
module.exports.delete.cat = "utils";