const glob = require('glob');
const path = require('path');

glob.sync('./lib/utils/**/*.js').forEach(function (file) {
    let name = file.split('/').pop().split('.')[0];
    module.exports[name] = require(path.resolve(file));
})