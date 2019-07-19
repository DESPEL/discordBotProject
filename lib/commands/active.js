module.exports.active = function (message) {
    message.delete(message)
    message.channel.send("P4 está activo en este momento").then(msg => msg.delete(10000));
    return;
}

module.exports.active.description = "Muestra si el bot está activo en el momento";
module.exports.active.args = "";
module.exports.active.cat = "utils";