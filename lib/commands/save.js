const Discord = require('discord.js');
var Codigos = [" "]
var x = Codigos.toString();

module.exports.codigo = async function (message){
    const filter = m => m.author.id === message.author.id;
    message.reply("Nombre del codigo:");
    message.channel.awaitMessages(filter,{max:1, time:100000}).then(collected=>{
        const CodigoNombre = collected.first().content;

        message.reply("Constitución del codigo:");
        message.channel.awaitMessages(filter,{max:1, time:100000}).then(collected2=>{
            const ConstCodigo = collected2.first().content;

            message.reply("Codigo creado");

            Codigos.push([CodigoNombre, ConstCodigo]);
            console.log(Codigos);
            message.channel.bulkDelete(6);

        }).catch(err=>{
            console.log(err);
            message.reply("Error al introducir el codigo, intente de nuevo.");
        })
    }).catch(err=>{
        console.log(err);
        message.reply("Error al introducir el nombre del codigo, intente de nuevo.");
    })
}

module.exports.codigosl = async function (message){

    
}