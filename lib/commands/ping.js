module.exports.ping = async function (message, bot) {
    var resMsg = await message.channel.send({
        embed: {
            color: 0xf94016,
            fields: [{
                name: "Ping",
                value: "Calculando..."
            }
            ],
        }
    });
    resMsg.edit({
        embed: {
            color: 0x2ed32e,
            fields: [{
                name: "Ping",
                value: parseInt(Math.round(resMsg.createdTimestamp - message.createdTimestamp) - bot.ping) + ' ms'
            }],
        }
    });
    return;
}

module.exports.ping.description = "Te permite ver tu ping con el servidor"
module.exports.ping.args = ""