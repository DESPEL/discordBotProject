const youtube = require('./../utils/youtube.js');
const arrayToString = require('./../utils/arrayToString');

module.exports.video = async function (message, bot, ...args) {
    if (args[0]) {
        let url = await youtube.search(...args);
        message.channel.send(url);
        return;
    }
    message.channel.send('Es necesario agregar el nombre de un video');
    return;
}

module.exports.video.description = "Permite obtener un video en base a su nombre";
module.exports.video.args = "<name>"
