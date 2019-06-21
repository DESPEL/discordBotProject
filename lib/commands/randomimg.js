const axios = require('axios');
const cheerio = require('cheerio');
const Discord = require('discord.js');

const errorMSG = new Discord.RichEmbed()
.setColor('0xff0000')
.setTitle('Error')
.setDescription('Intenta nuevamente');

let danbooruURL = "https://danbooru.donmai.us";

module.exports.randomimg = async function (message, nsfw = "") {
    let newMsg = await message.channel.send('Buscando...')
    if(nsfw == "all") {
        allimg(newMsg);
        return;
    }
    if(nsfw == "+18" || nsfw == "marranda" || nsfw == "lewd" || nsfw == "chochino" || nsfw == "nsfw") {
        lewdrandom(newMsg);
        return;
    }
    safeimg(newMsg);
}
module.exports.randomimg.description = "Permite obtener una imagen aleatoria, <nsfw> puede ser nada, 'all', '+18'";
module.exports.randomimg.args = "<nsfw>"

module.exports.lewd = async function(message) {
    let newMsg = await message.channel.send('Buscando...')
    lewdrandom(newMsg);
}
module.exports.lewd.description = "Permite obtener una imagen aleatoria +18";
module.exports.lewd.args = ""

module.exports.imgtag = async function(message, ...args) {
    let newMsg = await message.channel.send('Buscando...');
    tagrandom(newMsg, args)
};

module.exports.imgtag.description = "Busca una imagen según la categoria";
module.exports.imgtag.args = "<tag>";

async function tagrandom(message, tag, pagemax = 1000) {
    let pageURL = "https://danbooru.donmai.us/posts";
    const tagName = tag.toString().replace(/,/g, '_');
    const tags = "tags=" + tagName;
    const pageNumber = parseInt(Math.random() * (pagemax + 1));
    const page = "page=" + pageNumber.toString();

    pageURL = pageURL + '?' + page + '&' + tags;

    axios.get(pageURL).then(async (result) => {
        let $ = cheerio.load(result.data);
        let wikiPage = $('#excerpt').children();

        let images = $('#posts-container').children().filter('article');
        if (images.length == 0) {
            let contentWiki = $(wikiPage[0]).children();
            if (contentWiki.length < 3) {
                let embed = new Discord.RichEmbed()
                .setColor('0xFF0000')
                .setTitle('Error')
                .setDescription('No existe la tag especificada');
                message.channel.send(embed);
                return;
            } else {
                tagrandom(message, tag, pageNumber);
                return;
            }
        }
        let id = parseInt(Math.random() * images.length);
        let image = images[id];
        let imageURL = $(image).data('file-url');
        let imgNameURL = danbooruURL + $($(image).children()[0]).attr('href');
        let names = await axios.get(imgNameURL).then((result) => {
            let $ = cheerio.load(result.data);
            let name = $('meta[name="og:title"]').attr('content');
            let post = $('meta[name="canonical"]').attr('content');
            let names = {
                title: name,
                post : post
            }
            return names;
        });
        let embed = new Discord.RichEmbed()
            .setColor('0x42a7f4')
            .setTitle('imagen')
            .setImage(imageURL)
            .setTitle(names.title)
            .setDescription(names.post);
        message.edit(embed);
    });
}

function lewdrandom(message) {
    const page = "https://danbooru.donmai.us/posts/random";
    axios.get(page).then((result) => {
        let $ = cheerio.load(result.data);
        let link = $('#image-container').attr('data-file-url');
        let info = $('li');
        let safe = false;
        info.each(function (index, element) {
            if ($(element).text().trim() == "Rating: Safe") {
                safe = true;
            }
        });
        if (safe || !link) {
            lewdrandom(message);
            return;
        }
        let name = $('meta[name="og:title"]').attr('content');
        let post = $('meta[name="canonical"]').attr('content');
        let embed = new Discord.RichEmbed()
            .setColor('0x42a7f4')
            .setTitle('imagen')
            .setImage(link)
            .setTitle(name)
            .setDescription(post);
        message.edit(embed);
        return;
    });
}

function allimg(message) {
    const page = "https://danbooru.donmai.us/posts/random";
    axios.get(page).then((result) => {
        let $ = cheerio.load(result.data);
        let link = $('#image-container').attr('data-file-url');
        if (!link) {
            lewdrandom(message);
            return;
        }
        let name = $('meta[name="og:title"]').attr('content');
        let post = $('meta[name="canonical"]').attr('content');
        let embed = new Discord.RichEmbed()
            .setColor('0x42a7f4')
            .setTitle('imagen')
            .setImage(link)
            .setTitle(name)
            .setDescription(post);
        message.edit(embed);
        return;
    });
}

function safeimg(message) {
    const page = "https://danbooru.donmai.us/posts/random";
    axios.get(page).then((result) => {
        let $ = cheerio.load(result.data);
        let link = $('#image-container').attr('data-file-url');
        let info = $('li');
        let safe = false;
        info.each(function (index, element) {
            if ($(element).text().trim() == "Rating: Safe" || $(element).text().trim() == "Rating: Questionable") {
                safe = true;
            }
        });
        if (!safe || !link) {
            lewdrandom(message);
            return;
        }
        let name = $('meta[name="og:title"]').attr('content');
        let post = $('meta[name="canonical"]').attr('content');
        let embed = new Discord.RichEmbed()
            .setColor('0x42a7f4')
            .setTitle('imagen')
            .setImage(link)
            .setTitle(name)
            .setDescription(post);
        message.edit(embed);
        return;
    });
}