const axios = require('axios');
const cheerio = require('cheerio');

const page = 'https://soundcloud.com';

module.exports = async function (url) {
    let songs = new Array();
    await axios.get(url).then(function (result) {
        console.log(result.data);
        result.data = result.data.replace(/(<noscript>|<\/noscript>)|<noscript class="errorPage__inner">/g, '');
        const $ = cheerio.load(result.data);
        let listsongs = $('section.tracklist article');
        listsongs.each(function (index, element) {
            let songURL = page + $(element).find('h2 a[itemprop="url"]').attr('href');
            songs.push(songURL);
        });
    });
    
    return songs;
}