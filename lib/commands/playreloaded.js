const Discord = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const utils = require('./../utils');

let moduleArgs = "<youtube/soundcloud> <name>";

let queue = Array();

let noArguments = 'Es necesario agregar:' + moduleArgs;

class Track {
    constructor(message, src, url, sender, data) {
        this.message = message;
        this.src = src;
        this.url = url;
        this.sender = sender;
        this.data = data;
    }
}

module.exports.newplay = async function (message, source, ...args) {
    if(args.length == 0) {
        utils.message.error(message, noArguments);
        return;
    }

    if (!(source == "soundcloud" || source == "youtube")) {
        args.push(source);
        source = 'youtube';
    }

    if(source == 'youtube') {
        //Do some nice shit
        getData(args, source);
    }

    if(source == 'soundcloud') {
        //Do nicer shit
        await getData(args,source);
    }
    let song = new Track(message, source, data.link, message.member.user.tag,data);
    return;
}

async function getData(args, source) {
    if (source == 'youtube') {
        let data = await utils.youtube.data(args);
    }
    if (source == 'soundcloud') {
        let data = await utils.soundcloud.data(args);
    }
    return data;
}

module.exports.newplay.args = moduleArgs;
module.exports.newplay.description = "Reproduce una canción";