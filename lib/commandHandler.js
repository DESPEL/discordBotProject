const config = require("./../config.json");
const Discord = require('discord.js');
let commands = require('./commands');
let prefix = config.prefix;

let comandoInexistenteMSG = "El comando no existe"

exports.handle = function (message, bot) {
    let command = message.content.toLowerCase().split(" ")[0].slice(1); // Comando
    if (message.content[0] == prefix) {
        if ("function" == typeof commands[command]) {
            let args = message.content.toLowerCase().split(" ").slice(1); //Argumentos del comando
            commands[command](message, bot, ...args);
        } else {
            message.channel.send(comandoInexistenteMSG);
        }
    }
}