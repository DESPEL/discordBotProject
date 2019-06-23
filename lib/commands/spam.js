const Discord = require('discord.js');
const utils = require('./../utils');
const config = require('./../../config.json');

const moduleName = "Spam";

const startSpamMSG = "Iniciando spam";
const stopSpamMSG = "Deteniendo spam";

const numErrStr = 'La cantidad de mensajes debe de ser un número';
const roleErrStr = 'Debes de tener el rol "ok" para ejecutar este comando';
const stopErrMSG = 'No hay spam que detener';

let running = false;

module.exports.spam = async function (message, bot, ...args) {
    let amount = args[0] == "start" ? args[1] : args[0];
    amount == "stop" ? stopSpam(message) : startSpam(message, amount);
}

module.exports.spam.description = "Permite enviar cierta cantidad de mensajes de spam";
module.exports.spam.args = "<start/stop> <amount>"
module.exports.spam.rank = "ok";

async function startSpam(message, amount) {
    if (!isNaN(amount)) {
        running = true;
        await utils.message.success(message, startSpamMSG, moduleName);
        running = true;
        for (let i = 0; i < amount && running; i++) {
            await message.channel.send(Math.floor(Math.random() * 300));
        }
    } else {
        await utils.message.error(message, numErrStr);
    }
}

async function stopSpam(message) {
    if (running) {
        running = false;
        await utils.message.success(message, stopSpamMSG, moduleName);
    } else {
        await utils.message.error(message, stopErrMSG);
    }

}