const config = require("./config.json");
const Discord = require('discord.js');
const bot = new Discord.Client();
const embed = new Discord.RichEmbed();

const commandHandler = require("./lib/commandHandler.js");
console.log('Iniciando el bot...');

let prefix = config.prefix;

bot.on("ready", () => {
    console.log('El bot está encendido');
    console.log('Servers: ' + bot.guilds.size);
    let miembros = 0;
    bot.guilds.map(guild => {
        miembros = miembros + guild.members.size;
    });
    console.log('Miembros: ' + miembros);
});

bot.on("message", async message => {
    commandHandler.handle(message);
});

bot.login(config.token);
