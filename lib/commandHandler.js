const config = require("./../config.json");
const Discord = require('discord.js');

let utils = require('./utils');
let commands = require('./commands');
let prefix = config.prefix;

let comandoInexistenteMSG = "El comando no existe"

exports.handle = function (message, bot) {
    let command = message.content.toLowerCase().split(" ")[0].slice(1); // Comando
    if (message.content[0] == prefix) {
        if ("function" == typeof commands[command]) {
            if (commands[command].rank) {
                let ranks = commands[command].rank.split(' ');
                let canRun = true;
                ranks.forEach(function(value, index) {
                    if (!message.member.roles.find(r => r.name === value)) {
                        canRun = false;
                    };
                });
                if(canRun) {
                    let args = message.content.toLowerCase().split(" ").slice(1); //Argumentos del comando
                    commands[command](message, bot, ...args);
                } else {
                    utils.message.error(message, "Necesitas los roles: " + commands[command].rank + " para ejecutar el comando " + command);
                }
            } else {
                let args = message.content.toLowerCase().split(" ").slice(1); //Argumentos del comando
                commands[command](message, bot, ...args);
            }
        } else {
            message.channel.send(comandoInexistenteMSG);
        }
    }
}