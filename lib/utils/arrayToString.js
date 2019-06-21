module.exports = function(...args) {
    let string = "";
    args.forEach((value) => {
        string += value + " ";
    });
    return string;
}