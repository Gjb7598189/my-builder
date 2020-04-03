const fs = require("fs");
const util = require('util');
const download = util.promisify(require('download-git-repo'))
const templateMap = {
    react: 'direct:https://github.com/Gjb7598189/react-demo.git'
}

async function isExistDirectory(name) {
    const result = fs.existsSync(name);
    return result;
}

async function downloadTemplate(type, directory) {
    const repository = templateMap[type];
    let result;
    await download(repository, directory, { clone: true }).then(data => {
        result = !data;
    }).catch(err => {
        console.log(`${err}`);
        result = !err;
    });
    return result;
}

module.exports = {
    isExistDirectory,
    downloadTemplate
}