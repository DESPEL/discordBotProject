const Discord = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');
const https = require('https');

const config = require('./../../config.json');
const utils = require('./../utils');

const searchURL = 'https://www.ebay.com/sch/i.html?_nkw=';
const currencyAPI = 'https://api.exchangeratesapi.io/latest?base=MXN';

const maxRes = 5;
let rate;

module.exports.ebay = async function (message, bot, ...query) {
    rate = await getCurrencyRate();
    let results = new Array();

    let searchString;
    if (query instanceof Array) {
        if (query.length == 0) {
            utils.message.error(message, 'Es necesario proporcionar los argumentos del comando');
            return;
        }
        searchString = query.toString().replace('/,/g', '+').replace('/\s/g', '');
    } else {
        if (!query) {
            utils.message.error(message, 'Es necesario proporcionar los argumentos del comando');
            return;
        }
        searchString = query.replace('/\s/g', '+');
    }
    await axios.get(searchURL + searchString).then((response) => {
        const $ = cheerio.load(response.data);
        let res = $('.s-item__wrapper');
        res.each((index, element) => {
            let data = getItemData($, element);
            results.push(data);
        });

    });
    //console.log(results);

    if (results.length == 0) {
        utils.message.error(message, 'No se han encontrado resultados');
        return;
    }

    let embed = new Discord.RichEmbed()
        .setTitle('Resultados de la búsqueda')
        .setColor(config.botColor)
        .setThumbnail(results[0].thumbnail)
        .setDescription('Link: ' + searchURL + searchString);

    const maxChar = 50

    if (results.length > maxRes) {
        for (let i = 0; i < maxRes; i++) {
            let item = results.shift();
            let name = item.name.length < maxChar ? item.name : item.name.substr(0, maxChar) + '...';
            embed.addField(name, item.cost + ' - ' + item.hotness + '\n' + item.link);
        }
    } else {
        for (let i = 0; i < results.length; i++) {
            let item = results.shift();
            let name = item.name.length < maxChar ? item.name : item.name.substr(0, maxChar) + '...';
            embed.addField(name, item.cost + ' - ' + item.hotness + '\n' + item.link);
        }
    }

    message.channel.send(embed);
}

module.exports.ebay.args = '<artículo>';
module.exports.ebay.cat = 'web';

function getItemData($, item) {
    let name = $(item).find('.s-item__title').text().replace('PATROCINADO', '').replace('Anuncio nuevo', '');
    let cost = $(item).find('.s-item__price').text();
    let hotness = $(item).find('.s-item__hotness').text();
    if (hotness.substr(0, hotness.length / 2) == hotness.substr(hotness.length / 2, hotness.length)) {
        hotness = hotness.substr(hotness.length / 2, hotness.length);
    }
    let thumbnail = $(item).find('.s-item__image-img').attr('src');
    let link = $($(item).find('.s-item__link')[0]).attr('href').split('?_trkparms=')[0];

    let cost2 = 'USD $'+ (parseInt(cost.split(/\$/g)[1].replace(/\D+/g, '').trim()) / 100 * rate).toFixed(2);
    let data = {
        name: name,
        cost: cost2,
        hotness: hotness,
        thumbnail: thumbnail,
        link: link
    }

    return Object.assign({}, data);
}

async function getCurrencyRate() {
    let rates = await axios.get(currencyAPI).then(response => response.data);
    return rates.rates.USD;
}