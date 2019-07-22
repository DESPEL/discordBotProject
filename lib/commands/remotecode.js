const Discord = require('discord.js');
const fs = require('fs');
const http = require('https');
const decache = require('decache');

const utils = require('./../utils');

module.exports.experimental = async function (message, bot, ...name) {

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
    if (name[0] == "list") {
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

    if (name[0] == 'create') {
        let filename = name[1];
        if (filename.length != 0) {
            filename.toString().replace('/,/g', '').replace('/\s/g', '')
        } else {
            utils.message.error(message, 'Es necesario proporcinar el nombre del archivo a crear');
            return;
        }
        const dirPath = process.cwd() + '/lib/experimentalcmds/';
        let fileString = '';

        if (getCode(message.content).length < 5) {
            fileString = getFileString(filename);
        } else {
            fileString = getCode(message.content);
        }

        fs.writeFile(dirPath + filename + '.js', fileString, (err) => {
            if (err) {
                console.log(err);
                utils.message.error(message, 'Hubo un error al crear el archivo');
            }
            utils.message.success(message, 'Se ha ha creado el archivo: ' + filename);
        });

        return;
    }

    if (name[0] == 'compile') {
        let filename = name.slice(1);
        if (filename.length != 0) {
            filename.toString().replace('/,/g', '').replace('/\s/g', '');
        } else {
            utils.message.error(message, 'Es necesario proporcinar el nombre del archivo a compilar');
            return;
        }

        try {
        let compile = require('./../experimentalcmds/' + filename);
        } catch (err) {
            let errorstr = err.toString();
            let errstackstr = err.stack;
            if (errstackstr.length > 800) {
                errstackstr = errstackstr.substr(0,800);
            }
            let embed = new Discord.RichEmbed()
            .setTitle('Error al compilar ' + filename + '.js')
            .setDescription('```' + errorstr + '\n' + errstackstr + '```');
            message.channel.send(embed);
        }

        decache('./../experimentalcmds/' + filename);

        return;
    }

    if (name[0] == 'fetch') {
        const dirPath = process.cwd() + '/lib/experimentalcmds';
        console.log(dirPath);
        let embed = new Discord.RichEmbed()
            .setTitle('Archivo:' + name[1]);
        fs.readdir(dirPath, function (err, files) {
            //handling error
            if (err) {
                utils.message.error(message, 'Error al enviar el archivo');
                return;
            }
            let textString = "";
            console.log(files)
            if(files.includes(name[1] + '.js')) {
                message.channel.send(embed, {files: [dirPath + '/' + name[1] + '.js']});
            } else {
                utils.message.error(message, 'No existe el archivo solicitado');
                return;
            }

            embed.setDescription(textString);
            message.channel.send(embed);
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
    const request = http.get(url, function (response) {
        response.pipe(file);
        utils.message.success(message, 'Se ha agregado el archivo de comandos: ' + nameStr);
    }).on('error', (err) => { console.log(err) });

}

module.exports.experimental.rank = 'ok';


function getFileString(filename) {
    return `
//Archivo generado automáticamente;
const Discord = require('discord.js');

module.exports.${filename} = function(message, bot, ...args) {

}

module.exports.${filename}.description = '';
module.exports.${filename}.args = '';
module.exports.${filename}.rank = '';
        `;
}


function getCode(text) {
    let encloser = '`';
    let reps = 3;
    let pos = 1;

    let command = '';

    let inside = false;

    for (let i = 0; i < text.length; i++) {

        if (inside) {
            if (text[i] == encloser) pos++;
            command += text[i];
            if (pos == 6) {
                i = text.length;
            }
        }

        if (text[i] == encloser && !inside) {
            pos++;
            if (pos > 3) {
                inside = true;
            }
        }

        if (text[i] != encloser && !inside) {
            pos = 1;
        }
    }

    return command.substr(0, command.length - 3);

}