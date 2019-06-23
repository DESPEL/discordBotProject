const glob = require('glob');
const path = require('path');
const rootFolder = 'commands';

module.exports = {};

glob.sync('./lib/commands/**/*.js').forEach(function (file) {
    let name = file.split('/').pop().split('.')[0];
    let folder = file.split('/').slice(-2, -1)[0];
    if (folder != rootFolder) {
        if (!module.exports[folder]) module.exports[folder] = {};
        module.exports[folder][name] = require(path.resolve(file));
    } else {
        module.exports[name] = require(path.resolve(file));
    }
    adjustCommands(module.exports);
});

//Agregar abreviaturas a comandos
module.exports.articles = module.exports.article;

function adjustCommands(commands) {
    for (let key in commands) {
        if (typeof commands[key] == "object") {
            let commandGroup = Object.assign(commands[key]);
            commands[key] = undefined;
            adjustCommands(commandGroup);
            return;
        }
        module.exports[key] = commands[key];
    }
}