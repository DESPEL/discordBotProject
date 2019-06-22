const cheerio = require('cheerio');
const axios = require('axios');

const url = 'https://soundcloud.com';
const searchUrl = url + '/search/sounds?q=';


module.exports = async function (args) {
    let data = {};
    let name = args.toString().replace(/,/g, '%20');
    await axios.get(searchUrl + name).then(async function(result) {
        result.data = result.data.replace(/(<noscript>|<\/noscript>)|<noscript class="errorPage__inner">/g, '');
        let $ = cheerio.load(result.data);
        if ($('ul').length < 2) {
            data = undefined;
            return;
        }

        let results = $('ul li h2 a');
        let songRef = $(results[0]).attr('href');
        let songUrl = url + songRef;

        await axios.get(songUrl).then(async function (result) {
            result.data = result.data.replace(/(<noscript>|<\/noscript>)|<noscript class="errorPage__inner">/g, '');
            $ = cheerio.load(result.data);

            let songID = $('meta[property="twitter:app:url:googleplay"]').attr('content').split(':').pop();
            let apiURL = "http://api.soundcloud.com/tracks/" + songID + "/stream?consumer_key=71dfa98f05fa01cb3ded3265b9672aaf";
            let name = $('meta[property="twitter:title"]').attr('content');
            let thumbnail = $('meta[property="twitter:image"]').attr('content');
            let url = $('meta[property="og:url"]').attr('content');

            data.apiURL = apiURL;
            data.title = name;
            data.thumbnail = thumbnail;
            data.link = url;
            
        });
    });
    return data;
}