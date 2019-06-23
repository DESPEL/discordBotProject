const axios = require('axios');
const cheerio = require('cheerio');

const pageURL = 'https://www.technologyreview.com';
let searchURL = pageURL + "/search/?s=";
const spaceSTR = '%20';

const noNameSTR = 'name';

module.exports = async function (name) {
    let articles = new Array();
    if (name instanceof Array) {
        name = name.toString().replace(/,/g, spaceSTR);
    }

    console.log(name);

    if (name.trim() == '') {
        data.error = '';
        return data;
    }

    searchURL += name;

    await axios.get(searchURL).then(async function (result) {
        const $ = cheerio.load(result.data);
        let articlesURL = $('.feed-tz__title__link');
        let imagesURL = $('picture.feed-tz__image');

        articlesURL.each(function (index, element) {
            let article = $(element);
            let url = pageURL + article.attr('href');
            let name = article.text();
            let thumbnail = $(imagesURL[index]).data('iesrc');

            articleData = {
                name: name,
                url: url,
                thumbnail: thumbnail
            };

            articles.push(articleData);
        });

    });
    return articles;
}