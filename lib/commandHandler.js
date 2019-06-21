const config = require("./../config.json");
const Discord = require('discord.js');

//Load commands
let commands = {
    spam: require("./commands/spam"),
    active: require("./commands/active"),
    ping: require("./commands/ping"),
    delete: require("./commands/delete"),
    video: require("./commands/video"),
    play: require("./commands/play"),
    p: require("./commands/play"),
    queue: require("./commands/play").queue,
    cola: require("./commands/play").queue,
    q: require("./commands/play").queue,
    queueremove: require("./commands/play").queueremove,
    queuerm: require("./commands/play").queueremove,
    remove: require("./commands/play").queueremove,
    rm: require("./commands/play").queueremove,
    skip: require("./commands/play").skip,
    randomimg: require("./commands/randomimg"),
    rimg: require("./commands/randomimg"),
    imgtag: require("./commands/randomimg").imgtag,
    timg: require("./commands/randomimg").imgtag,
    lewd: require("./commands/randomimg").lewd,
    anime: require("./commands/anime"),
    help: require("./commands/help"),
    testloader: require("./commands/testloader")

}

exports.commands = commands;

//Load utils
const hasRole = require("./utils/hasRole").hasRole;

let prefix = config.prefix;

let comandoInexistenteMSG = "El comando no existe"

exports.handle = function (message) {
    let command = message.content.toLowerCase().split(" ")[0].slice(1); // Comando
    if (message.content[0] == prefix) {
        if ("function" == typeof commands[command]) {
            let args = message.content.toLowerCase().split(" ").slice(1); //Argumentos del comando
            commands[command](message, ...args);
        } else {
            message.channel.send(comandoInexistenteMSG);
        }
    }
}