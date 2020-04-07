#!/usr/bin/env node
const commander = require('commander');
const program = new commander.Command();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const spawn = require('cross-spawn');
const inquirer = require('inquirer');
const child = require('child_process');
const utils = require('./utils');

const cwd = process.cwd, argv = process.argv, exit = process.exit, log = console.log;
program
//   .action(name => {
//     projectName = name;
//   })
//   .arguments('<project-directory>')
//   .action(name => {
//       directory = name;
//   })
//   .option('-t --template <template of project>', 'react')
    .command('create [project-name] [project-type]')
    .description('create project')
    .action(async function(name, type = 'react') {
        const project = { type };
        if (name) {
            project.name = name;
            project.type = type;
        } else {
            const res = await inquirer.prompt(utils.questions.create);
            const { projectName, projectType } = res;
            console.log(res)
            project.name = projectName;
            project.type = projectType || type;
        };
        create(project);
    });
program
    .command('createRepo')
    .description('create remote repo')
    .action(async function() {
        const config = await inquirer.prompt(utils.questions.createRepo);
        console.log(config, 'res');
        const res = createRemote(config);
        // res.git_url && gitInit(res.gitInit);
    })

program
    .command('gitInit')
    .description('git 初始化；关联远端仓库')
    .action(gitInit)
  
program.parse(argv);

async function create({ name, type }) {
    console.log(name, type)
    const result = await utils.isExistDirectory(name); // 校验当前环境目录是否有同名文件夹
    if (result) {
        console.log(`${name}已存在，请重新输入文件夹名称`)
        exit(1);
    } else {
        const bool = fs.mkdirSync(name); // 创建项目文件夹
        bool ? log('创建文件夹失败') : log('创建文件成功');
        let loading = ora('开始下载模版');
        loading.start('模版下载中。。。')
        const result = await utils.downloadTemplate(type, name);
        if (result) {
            loading.succeed('模版下载完成');
        } else {
            loading.fail('模版下载失败');
            process.exit(1);
        }
        spawn.sync('rm', ['-rf', '.git'], { // 删除模版下面的.git文件
            cwd: path.join(cwd(), name)
        })
        console.log('即将为您安装项目依赖，请稍后。。。');
        const res = install(name);
        res && console.log('依赖安装完毕');

    }
}

function install(name) {
    const child = spawn.sync('npm', ['install'], {
        cwd: path.join(cwd(), name),
        stdio: "inherit"
    });
    child.stderr && console.log(child.stderr);
    return !child.error;
}

function createRemote(config) {
    const { userName, repoName, token } = config;
    // console.log(config, '-----config', `curl -u ${userName}:${token} https://api.github.com/user/repos -d '${JSON.stringify({ name: repoName })}'`)
    // const res = child.execSync(`curl -u ${userName}:${token} https://api.github.com/user/repos -d '${JSON.stringify({ name: repoName })}'`);
    const res = spawn.sync('curl', ['-u', `${userName}:${token}`, 'https://api.github.com/user/repos', '-d', JSON.stringify({ name: repoName })])
    const data = JSON.parse(res.stdout.toString());
    if (data.git_url) {
        console.log(`仓库创建成功：${chalk.green(data.clone_url)}`)
    }
    console.log(res.stdout.toString(), '-------')
    return JSON.parse(res.stdout.toString());
}

function gitInit() {
    inquirer.prompt(utils.questions.gitInit).then(res => {
        const { gitInit, remoteUrl } = res;
        if (gitInit && remoteUrl) {
            spawn.sync('git', ['init']);
            console.log('git init 执行完毕');
            const res = spawn.sync('git', ['remote', 'add', 'origin', remoteUrl]);
            console.log(res, 'remote add---')
        }
    })
}

// createRemote('Gjb7598189', 'new2', 'fcd8d31827648a51d7e9da2058f2f7e0979df104')
