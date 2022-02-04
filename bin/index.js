#! /usr/bin/env node

const {
    program
} = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');

program.version('1.0.0');

const templates = {
    url: 'https://github.com:Charlesqu76/tsx-react-mobx#master',
};

program
    .command('init <project>')
    .description('初始化项目模版')
    .action(async (projectName) => {
        const ora = await (await import('ora')).default;
        const spinner = ora('正在下载模版...');
        spinner.start();
        download(templates.url, projectName, {
            clone: true
        }, (err) => {
            if (err) {
                spinner.fail();
                console.log('下载失败')
            } else {
                spinner.succeed();
                inquirer.prompt([{
                        type: 'inpute',
                        name: 'name',
                        message: '请输入项目名称'
                    },
                    {
                        type: 'inpute',
                        name: 'description',
                        message: '请输入项目简介'
                    },
                    {
                        type: 'inpute',
                        name: 'author',
                        message: '请输入作者名称'
                    }
                ]).then((answers) => {
                    const packagePath = `${projectName}/package.json`
                    const packageContent = fs.readFileSync(packagePath, 'utf8')
                    const packageResult = handlebars.compile(packageContent)(answers);
                    fs.writeFileSync(packagePath, packageResult)
                })

            }
        })
    })

program.parse(process.argv);