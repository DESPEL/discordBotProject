const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function(url) {
    let songs = new Array();
    await axios.get(url).then(function (result) {
        console.log(result.data);
    });
}