const Discord = require('discord.js');
const fs = require('fs');
const http = require('https');

const utils = require('./../utils');

module.exports.experimental = async function(message, bot, ...name) {
    let nameStr;
    if (!name || name.length == 0) {
        utils.message.error(message, 'Es necesario agregar el nombre del archivo');
        return;
    }
    if (name instanceof Array) {
        nameStr = name.toString().replace('/,/g', '').replace('/\s/g', '');
    } else {
        nameStr = name.replace('/,/g', '').replace('/\s/g', '');
    }

    //Send all files
    if (nameStr == "list") {
        const dirPath = process.cwd() + '/lib/experimentalcmds';
        console.log(dirPath);
        let embed = new Discord.RichEmbed()
        .setTitle('Lista de archivos experimentales');
        fs.readdir(dirPath, function (err, files) {
            //handling error
            if (err) {
                utils.message.error(message, 'Error al leer los archivos');
                return;
            }
            let textString = "";
            //listing all files using forEach
            files.forEach(function (file) {
                textString += file + '\n';
            });
            if (textString.length == 0) {
                embed.setTitle('No existen comandos experimentales');
                message.channel.send(embed);
                return;
            }

            embed.setDescription(textString);
            message.channel.send(embed);
        });
        return;
    }

    if (name[0] == "delete") {
        let filename = name.slice(1);
        if (filename.length != 0) {
            filename.toString().replace('/,/g', '').replace('/\s/g', '')
        } else {
            utils.message.error(message, 'Es necesario proporcinar el nombre del archivo a eliminar');
            return;
        }
        const dirPath = process.cwd() + '/lib/experimentalcmds/';

        fs.unlink(dirPath + filename + '.js', function (err) {
            if (err) {
                console.log(err);
                utils.message.error(message, 'No existe el archivo seleccionado');
                return;
            };
            utils.message.success(message, 'El archivo: *' + filename + '.js* ha sido eliminado satisfactioriamente');
        }); 
        return;
    }

    console.log(message.attachments);
    if (message.attachments.array().length == 0) {
        utils.message.error(message, 'Es necesario subir un archivo javascript para ejecutar el comando');
        return;
    }
    let url = message.attachments.array()[0].url;
    console.log(url);
    if (!url.includes('.js')) {
        utils.message.error(message, 'Es necesario que el archivo sea javascript');
        return;
    }

    const file = fs.createWriteStream(process.cwd() + '/lib/experimentalcmds/' + nameStr + '.js');
    const request = http.get(url, function(response) {
        response.pipe(file);
        utils.message.success(message, 'Se ha agregado el archivo de comandos: ' + nameStr);
    }).on('error', (err) => { console.log(err)});

}

module.exports.experimental.rank = 'ok';