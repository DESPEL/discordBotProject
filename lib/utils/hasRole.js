module.exports = function(message, ...names) {
    let hasPerm = true;
    let roles = message.guild.roles;
    let rolesNameID = new Map();
    roles.forEach(function (value, key, map) {
        rolesNameID.set(roles.get(key).name, key);
    });
    names.forEach(function (value) {
        if (!message.member.roles.has(rolesNameID.get(value))) {
            hasPerm = false;
        }
    });
    return hasPerm;
}