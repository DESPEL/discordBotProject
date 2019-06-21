const glob = require('glob');
const path = require('path');
const rootFolder = 'utils';

module.exports = {};

glob.sync('./lib/utils/**/*.js').forEach(function (file) {
    let name = file.split('/').pop().split('.')[0];
    let folder = file.split('/').slice(-2, -1)[0];
    if (folder != rootFolder) {
        if (!module.exports[folder]) module.exports[folder] = {};
        module.exports[folder][name] = require(path.resolve(file));
    } else {
        module.exports[name] = require(path.resolve(file));
    }
});