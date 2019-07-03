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
let noSong = 'No existe una canción con ese nombre';
let invalidURL = 'La url de la playlist es inválida';
let addedToQueueMSG = 'Se ha añadido la canción a la cola';
let nowPlayingMSG = 'Reproduciendo ahora: ';
let outOfBoundingQueue = 'El número de canción a remover debe de estar dentro de la cola';


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

    if (!message.member.voiceChannel) {
        utils.message.error(message, noChannel);
        return;
    }

    if (source && !args) {
        args = new Array();
    }

    if (!(source == "soundcloud" || source == "youtube" || source == "playlist")) {
        args.push(source);
        source = 'youtube';
    }

    if (args.length == 0) {
        utils.message.error(message, noArguments);
        return;
    }

    if (source == 'youtube' || source == 'soundcloud') {
        addSongPlay(message, source, ...args)
    }

    if (source == 'playlist') {
        addPlaylist(message, ...args)
    }

    return;
}

module.exports.play.args = moduleArgs;
module.exports.play.description = "Reproduce una canción // de youtube o de soundcloud";

module.exports.playing = function (message) {
    nowPlaying(message)
}
module.exports.playing.args = "";
module.exports.playing.description = "Muestra la canción que se está reproduciendo";

module.exports.skip = function (message) {
    if (!playing) {
        utils.message.error(message, notPlaying);
        return;
    }
    song.dispatcher.end();
    return;
}

module.exports.skip.args = "";
module.exports.skip.description = "Termina la canción que se está reproduciendo";

module.exports.queue = function (message) {
    if (!playing) {
        utils.message.error(message, notPlaying);
        return;
    }

    let embed = new Discord.RichEmbed()
        .setColor(config.botColor)
        .setTitle('Cola de reproducción')
        .setThumbnail(song.data.thumbnail)
        .addField(nowPlayingMSG + song.data.title, song.data.link);

    queue.forEach((song, index) => {
        embed.addField((index + 1) + ': ' + song.data.title, song.data.link);
    });

    message.channel.send(embed);
}

module.exports.queue.args = "";
module.exports.queue.description = "Muestra las canciones en la cola";

module.exports.queueremove = function (message, bot, position) {
    position = position - 1;
    if (position > queue.length) {
        utils.message.error()
    }
}


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

        song.dispatcher = dispatcher;
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
    if (!playing) {
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

async function addSongPlay(message, source, ...args) {
    if (source == 'youtube') {
        data = await getData(args, source);
        if (!data) {
            utils.message.error(message, noSong);
            return;
        }
    }

    if (source == 'soundcloud') {
        data = await getData(args, source);
        if (!data) {
            utils.message.error(message, noSong);
            return;
        }
    }

    let song = new Track(message, source, data.link, message.member.user.tag, data);

    queue.push(song);

    if (playing) {
        addedToQueue(song);
    }

    if (!playing) {
        playing = true;
        play();
    }
};

async function addPlaylist(message, url) {
    if (typeof url != "string") {
        utils.message.error(message, invalidURL);
        return;
    }
    let from = url.split(/\/|\./g).filter((value) => value == 'youtube' || value == 'soundcloud');
    if (from.length == 0) {
        utils.message.error(message, invalidURL);
        return;
    }

    if (from[0].toLowerCase() == 'soundcloud') {
        let songsData = await utils.soundcloud.playlist(url);
        console.log(songsData);
    }

    if (from[0].toLowerCase() == 'youtube') {
        //let songsData = utils.youtube.playlist(url);
    }
};