module.exports = async function (message, bot) {
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
                value: Math.round(resMsg.createdTimestamp - message.createdTimestamp) - bot.ping + ' ms'
            }],
        }
    });
    return;
}

module.exports.description = "Te permite ver tu ping con el servidor"
module.exports.args = ""