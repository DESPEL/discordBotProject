const Discord = require('discord.js');
const utils = require('./../utils');
const hasRole = require('./../utils/hasRole');
const config = require('./../../config.json');

const moduleName = "Spam";

const startSpamMSG = "Iniciando spam";
const stopSpamMSG = "Deteniendo spam";

const numErrStr = 'La cantidad de mensajes debe de ser un número';
const roleErrStr = 'Debes de tener el rol "ok" para ejecutar este comando';
const stopErrMSG = 'No hay spam que detener';

let running = false;

module.exports = async function (message, ...args) {
    let amount = args[0] == "start" ? args[1] : args[0];
    amount == "stop" ? stopSpam(message) : startSpam(message);
}

async function startSpam(message, amount) {
    if (hasRole(message, 'ok')) {
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
    } else {
        await utils.message.error(message, roleErrStr);
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

module.exports.description = "Permite enviar cierta cantidad de mensajes de spam";
module.exports.args = "<start/stop> <amount>"