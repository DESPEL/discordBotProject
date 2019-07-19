const Discord = require('discord.js');
const config = require('./../../config.json');
let commands = require('../commands');

module.exports.help = async function(message) {
    await newHelp(message);
} 
module.exports.help.description = "Muestra los distintos comandos del bot";
module.exports.help.cat = 'utils';


async function newHelp(message, altmsg) {
    let cats = getCategories();
    let cmds = getCommands();

    let numList = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];

    const embed = new Discord.RichEmbed()
    .setTitle('Comandos por categoria');

    let cmdStr = "";
    cats.forEach((value, idx) => {
        cmdStr += '**' + (idx + 1) + '**.-' + value + ' \n';
    });
    embed.setDescription(cmdStr);
    let helpMSG;
    if(!altmsg) {
        helpMSG = await message.channel.send(embed)
    } else {
        helpMSG = await altmsg.edit(embed);
    }
    for(let i = 0; i < cats.length; i++) {
        await helpMSG.react(numList[i]);
    }

    const filter = (reaction, user) => {
        let emojis = new Array('1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣');
        console.log(reaction.emoji.name);
        return emojis.includes(reaction.emoji.name) && user.id == message.author.id;
    }

    helpMSG.awaitReactions(filter, {max: 1}).then(async collected => {
        let nums = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣'];
        let page = cats[nums.indexOf(collected.firstKey())];

        await helpMSG.clearReactions();

        let embed = new Discord.RichEmbed()
        .setTitle('Comandos de la categoría: ' + page);

        cmds[page].forEach((value, idx) => {
            if (!value.cmd.args) {
                value.cmd.args = '';
            }
            if (!value.cmd.description) {
                value.cmd.description = '*No hay una descripción definida*';
            }
            embed.addField((idx + 1) + '.- ' + value.name + ' ' + value.cmd.args, value.cmd.description);
        });

        helpMSG.edit(embed);
        await helpMSG.react('◀');
        await helpMSG.react('❌');
        const returnFilter = (reaction, user) => {
            let reactions = ['❌', '◀'];
            return reactions.includes(reaction.emoji.name) && user.id == message.author.id;
        }
        await helpMSG.awaitReactions(returnFilter, {max: 1}).then(async collected => {
            if (collected.firstKey() == '◀') {
                await helpMSG.clearReactions();
                newHelp(message, helpMSG);
                return;
            }
            if (collected.firstKey() == '❌') {
                helpMSG.delete();
                message.delete();
                return;
            }
        });
    });

}

function getCategories() {
    let cats = new Array();

    for (let element in commands) {
        if(!commands[element] || !commands[element].cat) {
            continue;
        }
        if (!cats.includes(commands[element].cat)) {
            cats.push(commands[element].cat);
        }
    }
    return cats;
}

function getCommands() {
    let cmds = {};
    let descs = {};
    for (let element in commands) {
        if (!commands[element]) {
            continue;
        }
        if (!commands[element].cat) {
            console.log('without category: ' + element);
            commands[element].cat = 'default';
        }
        if(cmds[commands[element].cat]) {
            let desc = commands[element].description;
            let cat = commands[element].cat;
            if (descs[cat].get(desc)) {
                let idx = descs[cat].get(desc);
                if (!cmds[cat][idx]){
                    continue;
                }
                cmds[cat][idx] = ({ cmd: commands[element], name: cmds[cat][idx].name + ', ' + element });
            } else {
                let index = cmds[cat].length;
                cmds[cat].push({ cmd: commands[element], name: element });
                descs[cat].set(desc, index);
            }
        } else {
            let desc = commands[element].description;
            let cat = commands[element].cat;

            cmds[cat] = new Array();
            cmds[cat].push({ cmd: commands[element], name: element });

            let index = cmds[cat].length;

            descs[cat] = new Map();
            descs[cat].set(desc, index);
        }
    }
    return cmds;
}