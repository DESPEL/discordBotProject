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
        bot.user.setPresence({
            status: "online",
            game: {
                name: "ser programado",
                type: "PLAYING"
            }
        });

    });
    console.log('Miembros: ' + miembros);
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));
bot.on("message", async message => {
    commandHandler.handle(message, bot);
});

bot.login(config.token);
