hasRole = require('./../utils/hasRole');

module.exports = function (message, ...args) {
    let amount = args[0];
    if (hasRole(message, 'ok')) {
        if (!isNaN(amount)) {
            for (let i = 0; i < amount; i++) {
                message.channel.send(Math.floor(Math.random() * 300));
            }
        } else {
            message.channel.send('La cantidad de mensajes debe de ser un número');
        }
    } else {
        message.channel.send('Debes de ser rango "ok" para ejecutar este comando');
    }
}

module.exports.description = "Permite enviar cierta cantidad de mensajes de spam";
module.exports.args = "<amount>"