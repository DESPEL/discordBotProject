const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const utils = require('../utils');
const config = require('./../../config.json');

const amoebaURL = 'https://ameobea.me/osutrack/user/';

module.exports.osu = async function (message, bot, userName) {
    console.log('\n\n\n\n Executing')
    if (!userName) {
        utils.message.error(message, 'Es necesario proporcionar un nombre de usuario');
    }

    console.log('userName: ' + userName);
    axios.get(amoebaURL + userName).then((result) => {
        //console.log(result.data);
        const $ = cheerio.load(result.data);
        let stats = $('.quickstat').text().trim();

        if (stats.length < 2) {
            utils.message.error(message, 'No se encontró el usuario');
            return;
        }

        let data = stats.split(/\s+/g);
        let profilePic = $('.img-rounded').attr('src');

        let rank = data[1];
        let pp = data[3];
        let acc = data[5];
        let plays = data[7];
        let level = data[9];
        let country = data[11];

        embed = new Discord.RichEmbed()
            .setTitle('Perfil de: ' + userName)
            .setColor(config.botColor)
            .setThumbnail(profilePic)
            .setDescription('Rank: ' + rank + '\nPP: ' + pp + '\n Acc: ' + acc + '\nPlays: ' + plays + '\nLevel: ' + level + '\nCountry: ' + country);
        message.channel.send(embed);

    });
}

module.exports.args = '<nombre>';
module.exports.description = 'Muestra el perfil de un jugador de osu!';
module.exports.cat = 'anime';