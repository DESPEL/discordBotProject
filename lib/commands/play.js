const utils = require('./../utils');
const youtube = require('./../utils').youtube;
const ytdl = require('ytdl-core');
const Discord = require('discord.js');

const ModuleName = 'Reproductor Musical';

let queue = new Array();
let nowPlaying;
let playing = false;
let message;
let songModule;
let connObj;

const emptyQueueSTR = 'No hay nada en la cola';
const queueSTR = 'Cola';

module.exports.play = async function (msg, ...args) {
    message = msg;
    if (message.member.voiceChannel) {
        play(message, args);
    }
}

module.exports.play.description = "Permite escuchar una canción (o video)"
module.exports.play.args = "<nombre>"


module.exports.queue = async function (message) {
    if (queue.length == 0 && !nowPlaying) {
        utils.message.default(message, ModuleName, emptyQueueSTR);
        return
    }
    let nowPlayingData = await youtube.data(nowPlaying);
    let queueData = await getQueueData();

    utils.message.default(message, ModuleName, ' ', function (embed, nowPlayingData, queueData) {

        embed.addField('Reproduciendo: ' + nowPlayingData.title, nowPlayingData.link)
            .setThumbnail(nowPlayingData.thumbnail);
        embed.addBlankFied();
        queueData.forEach((value, index) => {
            embed.addField((index + 1) + '. ' + value.title , value.link);
        });

    }, nowPlayingData, queueData);
}

module.exports.queue.description = "Permite ver las canciones en la cola"
module.exports.queue.args = ""

module.exports.queueremove = async function (message, position) {
    console.log(position);
    console.log(typeof position);
    if (!position) {
        let errorMSG = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('Error')
            .setDescription('Es necesario proporcionar la posición de la cola de la canción a remover');
        message.channel.send(errorMSG);
        return;
    }

    position = parseInt(position) - 1;

    if (typeof position != "number") {
        let errorMSG = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('Error')
            .setDescription('El número de la canción a borrar debe ser un número');
        message.channel.send(errorMSG);
        return;
    }

    if (!queue[position]) {
        let errorMSG = new Discord.RichEmbed()
            .setColor('#FF0000')
            .setTitle('Error')
            .setDescription('La posición debe de estar dentro del rango de ;queue');
        message.channel.send(errorMSG);
        return;
    }
    let data = await youtube.data(queue[position]);
    let title = data.title;
    let link = data.link;
    let thumbnail = data.thumbnail;

    let stringDeleted = new Discord.RichEmbed()
        .setColor('0x42a7f4')
        .setTitle('Se ha eliminado la canción de la cola')
        .addField(title, link)
        .setThumbnail(thumbnail);
    message.channel.send(stringDeleted);

    queue.splice(position, 1);

}

module.exports.queueremove.description = "Permite borrar una canción (o video) de la cola"
module.exports.queueremove.args = "<posición>"

module.exports.skip = function () {
    songModule.end();
    music(connObj);
}

module.exports.skip.description = "Permite saltar una canción en reproducción"
module.exports.skip.args = ""

//Funciones

function nextSong() {
    if (queue.length == 0) {
        return false;
    }
    let url = queue.shift();
    console.log(url);
    return url;
}

function addSong(url) {
    queue.push(url);
    return true;
}

async function play(message, args) {
    const channel = message.member.voiceChannel;

    if (!playing) {
        if (args.length > 0) {
            let data = await youtube.data(args);
            if (!data) {
                let errorMSG = new Discord.RichEmbed()
                    .setColor('0xFF0000')
                    .setTitle('La canción no existe')
                    .setDescription('La canción no existe');
                message.channel.send(errorMSG);
                music(connection);
                playing = false;
                return;
            }
            playing = true;
            channel.join().then(async (connection) => {
                connObj = connection;
                addSong(args);
                music(connection);
            }).catch((err) => {
                console.log(err);
            });
        } else {
            message.channel.send('Es necesario introducir el nombre de una canción')
        }
    } else {
        let data = await youtube.data(args);
        console.log('info');
        console.log(data);
        if (!data) {
            let errorMSG = new Discord.RichEmbed()
                .setColor('0xFF0000')
                .setTitle('Error')
                .setDescription('Error');
            message.channel.send(errorMSG);
            return;
        }
        let name = data.title;
        let thumbnail = data.thumbnail;
        let link = data.link;
        let addMessage = new Discord.RichEmbed()
            .setColor('0x42a7f4')
            .setTitle('Canción añadida a la cola')
            .setThumbnail(thumbnail)
            .addField(name, link);
        message.channel.send(addMessage);
        addSong(args);
    }
}

async function music(connection) {
    console.log('Entrando a canal');
    let next = nextSong();
    if (!next) return;

    nowPlaying = next;
    const channel = message.member.voiceChannel;
    let data = await youtube.data(next);
    let url = data.link;
    let thumbnail = data.thumbnail;
    let songName = data.title;

    const dispatcher = await connection.playStream(ytdl(
        url,
        { filter: 'audioonly' }
    ));
    songModule = dispatcher;

    let stringPlaying = new Discord.RichEmbed()
        .setColor('0x42a7f4')
        .setTitle('Reproduciendo ahora')
        .addField(songName, url)
        .setThumbnail(thumbnail);
    message.channel.send(stringPlaying);

    dispatcher.on("end", () => {
        if (queue.length != 0) {
            music(connection);
        } else {
            playing = false;
            console.log('leaving');
            nowPlaying = undefined;
            channel.leave();
        }
    });
}

async function getQueueData() {
    let queueData = new Array();

    for (let index = 0; index < queue.length; index++) {
        let itemData = await utils.youtube.data(queue[index]);
        queueData.push(itemData);
    }
    console.log(queueData);
    return queueData;
}