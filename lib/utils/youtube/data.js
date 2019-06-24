let search = require('scrape-youtube');
let arrayToString = require('./../arrayToString');

module.exports = async function (name) {
    if (Array.isArray(name)) {
        name = name.toString().replace(/,/g, ' ');
    }
    const url = await search(name, { limit: 1 }).then(async function (result) {
        console.log(result);
        return result[0];
    });
    
    return url;
}