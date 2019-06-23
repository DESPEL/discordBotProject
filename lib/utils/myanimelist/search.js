const cheerio = require('cheerio');
const axios = require('axios');

const pageURL = 'https://myanimelist.net'
const searchURL = pageURL + '/search/all?q=';

module.exports = async function(type, name) {
    if (name instanceof Array) {
        name = name.toString().replace(/,/g, '%20');
    }

    let resultsData = new Array();

    await axios.get(searchURL + name).then(function(result) {
        const $ = cheerio.load(result.data);
        let results = $($('#' + type)[0]).next().children();
        results.each(function(index, element) {
            let thumbnail = $(element).find('img').attr('src');
            let name = $(element).find('img').attr('alt');
            let link = $(element).find('div.information a').attr('href');

            let data = {
                thumbnail: thumbnail,
                name: name,
                link: link
            }
            if(!thumbnail) return;
            resultsData.push(data);
        });
    });

    return resultsData;
}