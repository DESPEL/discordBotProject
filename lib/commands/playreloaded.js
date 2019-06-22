const Discord = require('discord.js');
const request = require('request');
const ytdl = require('ytdl-core');

const utils = require('./../utils');
const config = require('./../../config.json');

let moduleArgs = "<youtube/soundcloud> <name>";

let queue = Array();
let song = undefined;

let playing = false;

let noArguments = 'Es necesario agregar:' + moduleArgs;
let noChannel = 'Es necesario estar en un canal de voz para ejecutar este comando';
let errorMsg = 'Hubo un error al reproducir la canción';
let notPlaying = 'No se está reproduciendo ninguna canción';
let addedToQueueMSG = 'Se ha añadido la canción a la cola';
let nowPlayingMSG = 'Reproduciendo ahora:'


let botChannel = undefined;

class Track {
    constructor(message, src, url, sender, data) {
        this.message = message;
        this.src = src;
        this.url = url;
        this.sender = sender;
        this.data = data;
        this.channel = message.member.voiceChannel;
    }
}

module.exports.play = async function (message, bot, source, ...args) {
    let data;

    if(!message.member.voiceChannel) {
        utils.message.error(message, noChannel);
        return;
    }

    if(args.length == 0) {
        utils.message.error(message, noArguments);
        return;
    }

    if (!(source == "soundcloud" || source == "youtube")) {
        args.push(source);
        source = 'youtube';
    }

    if(source == 'youtube') {
        data = await getData(args, source);
    }

    if(source == 'soundcloud') {
        data = await getData(args,source);
    }

    let song = new Track(message, source, data.link, message.member.user.tag,data);

    queue.push(song);

    if(playing) {
        addedToQueue(song);
    }

    if(!playing) {
        playing = true;
        play();
    }

    return;
}

module.exports.play.args = moduleArgs;
module.exports.play.description = "Reproduce una canción // de youtube o de soundcloud";

module.exports.playing = function (message) {
    nowPlaying(message)
}
module.exports.playing.args = moduleArgs;
module.exports.playing.description = "Muestra la canción que se está reproduciendo";

async function play() {
    let dispatcher;
    song = queue.shift();
    console.log(song.data.title);
    channel = song.channel;
    channel.join().then(async function (connection) {
        if (song.src == 'youtube') {
            let stream = ytdl(
                song.url,
                { filter: 'audioonly' }
            );
            dispatcher = await connection.playStream(stream);
        }

        if (song.src == 'soundcloud') {
            let stream = request(song.data.apiURL);
            stream.on('error', function (err) {
                utils.message.error(song.message, errorMsg + '\n' + err);
            });
            dispatcher = await connection.playArbitraryInput(stream);
        }

        //TODO Mensaje de reproducir canción
        nowPlaying();

        dispatcher.on('end', function () {
            if (queue.length > 0) {
                play();
            } else {
                playing = false;
                song.message.member.voiceChannel.leave();
            }
        });
    });
}

async function getData(args, source) {
    let data
    if (source == 'youtube') {
        data = await utils.youtube.data(args);
    }
    if (source == 'soundcloud') {
        data = await utils.soundcloud.data(args);
    }
    return data;
}


function addedToQueue(song) {
    let embed = new Discord.RichEmbed()
    .setColor(config.botColor)
    .setTitle(addedToQueueMSG)
    .setThumbnail(song.data.thumbnail)
    .addField(song.data.title, song.data.link)
    song.message.channel.send(embed);
}

function nowPlaying(message = song.message) {
    if(!playing) {
        utils.message.error(message, notPlaying);
        return;
    }
    let embed = new Discord.RichEmbed()
        .setColor(config.botColor)
        .setTitle(nowPlayingMSG)
        .setThumbnail(song.data.thumbnail)
        .addField(song.data.title, song.data.link);
    message.channel.send(embed);

    return;
}