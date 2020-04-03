#!/usr/bin/env node
const commander = require('commander');
const program = new commander.Command();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const download = require('download-git-repo');
const ora = require('ora');
const spawn = require('cross-spawn');
const utils = require('./utils');

const cwd = process.cwd(), argv = process.argv, exit = process.exit, log = console.log;
let directory;
program
  .action(name => {
    projectName = name;
  })
  .arguments('<project-directory>')
  .action(name => {
      directory = name;
  })
  .option('-t --template <template of project>', 'react')
  .parse(argv);

if (directory) {
    const { template = 'react' } = program;
    create(directory, template);
}

async function create(directory, template) {
    const result = await utils.isExistDirectory(directory); // 校验当前环境目录是否有同名文件夹
    if (result) {
        console.log(`${directory}已存在，请重新输入文件夹名称`)
        exit(1);
    } else {
        const bool = fs.mkdirSync(directory); // 创建项目文件夹
        bool ? log('创建文件夹失败') : log('创建文件成功');
        let loading = ora('开始下载模版');
        loading.start('模版下载中。。。')
        const result = await utils.downloadTemplate(template, directory);
        result && loading.succeed('模版下载完成');
        spawn.sync('rm', ['-rf', '.git'], { // 删除模版下面的.git文件
            cwd: path.join(process.cwd(), directory)
        })
        console.log('即将为您安装项目依赖，请稍后。。。');
        const res = init();
        res && console.log('依赖安装完毕');

    }
}

function init() {
    const child = spawn.sync('npm', ['install'], {
        cwd: path.join(process.cwd(), directory),
        stdio: "inherit"
    });
    child.stderr && console.log(child.stderr);
    return !child.error;
}
