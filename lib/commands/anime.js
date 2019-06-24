const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

const utils = require('./../utils');
const config = require('./../../config.json');

let url = "https://www.crunchyroll.com/random/anime";

const noArgs = "Es neesario proporcionar un nombre de búsqueda";
const noLastSearch = "No hay más resultados";

const maxResults = 3;

let lastAnimeSearch = undefined;
let lastMangaSearch = undefined;

module.exports.randomanime = function (message, bot) {
    console.log('something');
    axios.get(url).then(function (result) {
        console.log('asdasd');
        $ = cheerio.load(result.data);
        let animeURL = $("[itemprop*='url']");
        message.channel.send($(animeURL[6]).attr('href'));
    });
}

module.exports.randomanime.description = "Envia un anime aleatorio por el chat";
module.exports.randomanime.args = "";

module.exports.anime = async function (message, bot, ...name) {
    if (!name) {
        utils.message.error(message, noArgs);
        return;
    }

     message = await message.channel.send('Buscando...');

    if (name.length == 0) {
        axios.get(url).then(function (result) {
            console.log('asdasd');
            $ = cheerio.load(result.data);
            let animeURL = $("[itemprop*='url']");
            message.edit($(animeURL[6]).attr('href'));
        });
        return;
    }
    
    if (name == "more") {
        if (!lastAnimeSearch || lastAnimeSearch.length == 0) {
            lastAnimeSearch = undefined;
            utils.message.error(message, noLastSearch);
            return;
        }

        let embed = new Discord.RichEmbed()
            .setColor(config.botColor)
            .setTitle('Siguientes resultados')
            .setThumbnail(lastAnimeSearch[0].thumbnail);

        let nRes = lastAnimeSearch.length > maxResults ? maxResults : lastAnimeSearch.length;

        for (let i = 0; i < nRes; i++) {
            let data = lastAnimeSearch.shift();
            embed.addField(data.name, data.link);
        }
        message.edit(embed);
        return;
    }

    if (!name instanceof Array) {
        let item = name;
        name = new Array();
        name.push(item);
    }

    lastAnimeSearch = await utils.myanimelist.search('anime', name);

    let embed = new Discord.RichEmbed()
        .setColor(config.botColor)
        .setTitle('Resultados de la búsqueda')
        .setThumbnail(lastAnimeSearch[0].thumbnail);

    let nRes = lastAnimeSearch.length > maxResults ? maxResults : lastAnimeSearch.length;

    for (let i = 0; i < nRes; i++) {
        let data = lastAnimeSearch.shift();
        embed.addField(data.name, data.link);
    }
    message.edit(embed);
}

module.exports.anime.args = "<name/more>";
module.exports.anime.description = "Busca un anime en myanimelist, para ver más resultados utiliza ;anime more";

module.exports.manga = async function (message, bot, ...name) {
    message = await message.channel.send('Buscando...');
    if (!name) {
        utils.message.error(message, noArgs);
        return;
    }

    if (name == "more") {
        if (!lastMangaSearch || lastMangaSearch.length == 0) {
            lastMangaSearch = undefined;
            utils.message.error(message, noLastSearch);
            return;
        }

        let embed = new Discord.RichEmbed()
            .setColor(config.botColor)
            .setTitle('Siguientes resultados')
            .setThumbnail(lastMangaSearch[0].thumbnail);

        let nRes = lastMangaSearch.length > maxResults ? maxResults : lastMangaSearch.length;

        for (let i = 0; i < nRes; i++) {
            let data = lastMangaSearch.shift();
            embed.addField(data.name, data.link);
        }
        message.edit(embed);
        return;
    }

    if (!name instanceof Array) {
        let item = name;
        name = new Array();
        name.push(item);
    }

    lastMangaSearch = await utils.myanimelist.search('manga', name);

    let embed = new Discord.RichEmbed()
        .setColor(config.botColor)
        .setTitle('Resultados de la búsqueda')
        .setThumbnail(lastMangaSearch[0].thumbnail);

    let nRes = lastMangaSearch.length > maxResults ? maxResults : lastMangaSearch.length;

    for (let i = 0; i < nRes; i++) {
        let data = lastMangaSearch.shift();
        embed.addField(data.name, data.link);
    }
    message.edit(embed);
}

module.exports.manga.args = "<name/more>";
module.exports.manga.description = "Busca un manga en myanimelist, para ver más resultados utiliza ;manga more";