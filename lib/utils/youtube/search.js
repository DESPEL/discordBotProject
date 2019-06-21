let search = require('scrape-youtube');
let arrayToString = require('./../arrayToString');

module.exports = async function (name) {
    if (Array.isArray(name)) {
        console.log("array name")
        name = name.toString().replace(/,/g, ' ');
    }
    console.log(name);
    const url = await search(name, { limit: 1 }).then(async function (result) {
        console.log(result);
        return result[0].link;
    });
    return url;
}