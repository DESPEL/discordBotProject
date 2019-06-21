const Discord = require('discord.js');
const hasRole = require('./../utils/hasRole');
const config = require('./../../config.json');

let startSpamMSG = "Iniciando spam";
let stopSpamMSG = "Deteniendo spam";

let successMSG = new Discord.RichEmbed()
    .setColor(config.botColor)
    .setTitle('Spam')

let numErrStr = 'La cantidad de mensajes debe de ser un número';
let roleErrStr = 'Debes de tener el rol "ok" para ejecutar este comando';
let stopErrMSG = 'No hay spam que detener';

let actualErrStr = '';

let errorMSG = new Discord.RichEmbed()
    .setColor(config.errorColor)
    .setTitle('Error')

let running = false;

module.exports = async function (message, ...args) {
    let amount = args[0];

    if (amount == "stop") {
        stopSpam(message);
        return;
    }

    if (hasRole(message, 'ok')) {
        if (!isNaN(amount)) {
            running = true;
            successMSG.setDescription(startSpamMSG);
            await message.channel.send(successMSG);
            startSpam(message, amount)
        } else {
            errorMSG.setDescription(numErrStr);
            message.channel.send(errorMSG);
        }
    } else {
        errorMSG.setDescription(roleErrStr);
        message.channel.send(errorMSG);
    }
}

async function startSpam(message, amount) {
    running = true;
    for (let i = 0; i < amount && running; i++) {
        await message.channel.send(Math.floor(Math.random() * 300));
        console.log(running);
    }
}

function stopSpam(message) {
    if (running) 
    {
        running = false;
        successMSG.setDescription(stopSpamMSG);
        message.channel.send(successMSG);
    } else {
        errorMSG.setDescription(stopErrMSG);
        message.channel.send(errorMSG);
    }

}

module.exports.description = "Permite enviar cierta cantidad de mensajes de spam";
module.exports.args = "<amount>"