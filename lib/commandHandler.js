const config = require("./../config.json");
const Discord = require('discord.js');
let decache = require('decache');

let utils = require('./utils');
let commands = require('./commands');
let prefix = config.prefix;

let comandoInexistenteMSG = "El comando no existe"

exports.handle = function (message, bot) {
    let command = message.content.toLowerCase().split(" ")[0].slice(1); // Comando
    if (message.content[0] == prefix) {

        if (command == "test") {
            try {
                let ecommand = message.content.toLowerCase().split(" ")[1];
                let experimentalCommands = require('./experimentalcommands');
                if ("function" == typeof experimentalCommands[ecommand]) {
                    if (experimentalCommands[ecommand].rank) {
                        let ranks = experimentalCommands[ecommand].rank.split(' ');
                        let canRun = true;
                        ranks.forEach(function (value, index) {
                            if (!message.member.roles.find(r => r.name === value)) {
                                canRun = false;
                            };
                        });
                        if (canRun) {
                            let args = message.content.toLowerCase().split(" ").slice(2); //Argumentos del comando
                            experimentalCommands[ecommand](message, bot, ...args);
                        } else {
                            utils.message.error(message, 'Experimental: Necesitas los roles: "' + experimentalCommands[ecommand].rank + '" para ejecutar el comando ' + command);
                        }
                    } else {
                        let args = message.content.toLowerCase().split(" ").slice(2); //Argumentos del comando
                        experimentalCommands[ecommand](message, bot, ...args);
                    }
                } else {
                    message.channel.send('Experimental: ' + comandoInexistenteMSG);
                }
                decache('./experimentalcommands');
            } catch (err) {
                let errorstr = err.toString();
                let errstackstr = err.stack;
                if (errstackstr.length > 800) {
                    errstackstr = errstackstr.substr(0, 800);
                }
                let embed = new Discord.RichEmbed()
                    .setTitle('Error al cargar los comandos experimentales')
                    .setDescription('```' + errorstr + '\n' + errstackstr + '```');
                message.channel.send(embed);
            }

            return;
        }

        if ("function" == typeof commands[command]) {
            if (commands[command].rank) {
                let ranks = commands[command].rank.split(' ');
                let canRun = true;
                ranks.forEach(function (value, index) {
                    if (!message.member.roles.find(r => r.name === value)) {
                        canRun = false;
                    };
                });
                if (canRun) {
                    let args = message.content.toLowerCase().split(" ").slice(1); //Argumentos del comando
                    commands[command](message, bot, ...args);
                } else {
                    utils.message.error(message, 'Necesitas los roles: "' + commands[command].rank + '" para ejecutar el comando ' + command);
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

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}