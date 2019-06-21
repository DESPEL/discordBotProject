module.exports = function (message) {
    message.delete(message)
    message.channel.send("P4 está activo en este momento").then(msg => msg.delete(10000));
    return;
}

module.exports.description = "Muestra si el bot está activo en el momento";
module.exports.args = "";