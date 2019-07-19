const utils = require('../utils');
const Discord = require('discord.js');
const config = require('./../../config.json');

const foundArticles = "Artículos encontrados";
const noArticles = 'No se encontraron artículos';

const noArgs = 'Es necesario agregar los argumentos del comando';

module.exports.article = async function(message, bot, amount, ...args) {
    if (!amount) {
        utils.message.error(message, noArgs);
        return;
    }

    if (!args) {
        args = [];
    }

    console.log(args);
    if (typeof args == 'string') {
        let name = args.slice();
        args = new Array();
        args.push(name);
        console.log(args);
    }

    if(isNaN(parseInt(amount))) {
        args.unshift(amount);
        amount = 5;
    }

    let newMSG = await message.channel.send('Buscando...');
    let articles = await utils.techreview.search(args);
    let length = articles.length >= amount ? amount : articles.length;

    if(articles.length == 0) {
        let embed = new Discord.RichEmbed()
            .setColor(config.botColor)
            .setTitle(foundArticles)
            .setDescription(noArticles);
        newMSG.edit(embed);
        return;
    }

    let embed = new Discord.RichEmbed()
    .setColor(config.botColor)
    .setTitle(foundArticles)
    .setThumbnail(articles[0].thumbnail);

    for(let i = 0; i < length; i++) {
        embed.addField(articles[i].name, articles[i].url);
    }

    newMSG.edit(embed);
    return;
}

module.exports.article.args = "<max amount> <name>"
module.exports.article.description = "Busca artículos relacionados al nombre en tehcnologyreview.com";
module.exports.article.cat = "educative";