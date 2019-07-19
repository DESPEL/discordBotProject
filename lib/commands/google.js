const Discord = require('discord.js');
const cheerio = require('cheerio');
const axios = require('axios');

const config = require('./../../config.json');
const utils = require('./../utils');

const googleURL = "https://www.google.com/search?q="

const maxRes = 5;

let lastSearch = undefined;

module.exports.google = async function (message, bot, ...query) {
    let results = new Array();

    let searchString;
    if (query instanceof Array) {
        if (query.length == 0) {
            return;
        }
        searchString = query.toString().replace('/,/g', '%20').replace('/\s/g', '');
    } else {
        if (!query) {
            return;
        }
        searchString = query;
    }

    await axios.get(encodeURI(googleURL + searchString)).then(function(response) {
        console.log(response.data);
        const $ = cheerio.load(response.data);
        let searchResults = $('.ZINbbc.xpd.O9g5cc.uUPGi');
        
        searchResults.each((index, element) => {
            let url = $($(element).find('a')[0]).attr('href');
            let title = $(element).find('.vvjwJb').text();
            if(!url || title.trim().length == 0) {
                return;
            }
            //let page = $(element).find('.UPmit');
            console.log(url, title);
            url = url.replace('/url?q=', '').split('&')[0];
            let result = {
                url: url,
                title: title,
                //page: page
            }

            results.push(result);
        });
    });

    let msg = new Discord.RichEmbed()
    .setTitle('Resultados de la búsqueda')
    .setColor(config.botColor);


    if (results.length > maxRes) {
        for (let i = 0; i < maxRes; i++) {
            let item = results.shift();
            if (item.url.includes('/search?')){
                i--;
                continue;
            }
            if (item.title.trim().length == 0) {
                i--;
                continue;
            }
            msg.addField( (i + 1) + '.- ' + item.title, item.url);
        }
    } else {
        if (results.length == 0) {
            let noResults = 'No se han encontrado resultados'
            utils.message.error(message, noResults);
            return;
        }
        for (let i = 0; i < results.length; i++) {
            let item = results.shift();
            if (item.url.includes('/search?')) {
                i--;
                continue;
            }
            if (item.title.trim().length == 0) {
                i--;
                continue;
            }
            msg.addField((i + 1) + '.- ' + item.title, item.url);
        }
    }

    message.channel.send(msg);

}

module.exports.google.args = "<texto>";
module.exports.google.cat = "utils";