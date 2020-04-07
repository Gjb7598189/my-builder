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

const questions = {
    create: [
        {
            name: 'projectName',
            type: 'input',
            message: '请输入项目名称'
        }, {
            name: 'projectType',
            type: 'list',
            message: '请选择项目类型',
            choices: [{ name: 'react', value: 'react' }, { name: 'vue', value: 'vue' }],
            default: 'react'
        }
    ],
    createRepo: [{
        type: 'input',
        name: 'userName',
        message: '请输入git用户名',
        default: 'Gjb7598189'
    }, {
        type: 'input',
        name: 'repoName',
        message: '请输入git仓库名称'
    }, {
        type: 'input',
        name: 'token',
        message: '请输入git token',
        default: 'fcd8d31827648a51d7e9da2058f2f7e0979df104'
    }],
    gitInit: [{
        type: 'confirm',
        name: 'gitInit',
        message: '是否同意执行以下命令：git init; git remote add'
    }, {
        type: 'input',
        name: 'remoteUrl',
        message: '请输入要关联的git地址'
    }]
}

module.exports = {
    isExistDirectory,
    downloadTemplate,
    questions
}