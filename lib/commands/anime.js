const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

let url = "https://www.crunchyroll.com/random/anime";

module.exports = function (message) {
    console.log('something');
    axios.get(url).then(function(result) {
        console.log('asdasd');
        $ = cheerio.load(result.data);
        let animeURL = $("[itemprop*='url']");
        message.channel.send($(animeURL[6]).attr('href'));
    });
}

module.exports.description = "Envia un anime aleatorio por el chat"
module.exports.args = ""