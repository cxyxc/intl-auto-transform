#!/usr/bin/env node
'use strict';

const babel = require('@babel/core');
const path = require('path');
const manager = require('./manager');
const fs = require('file-system');

const currentDir = process.cwd();

const format = require("prettier-eslint");

fs.recurseSync(currentDir, [
    '**/*.js',
    '**/*.jsx',
], (filepath, relative, filename) => {
    if(!filename) return;

    // 计算相对路径前缀
    const prefixLength = filepath.replace(currentDir, '').split('/').filter(i => i).length - 1;
    const prefixArray = [];
    for(let i = 0; i < prefixLength; i++)
        prefixArray.push('..');
    const prefix = prefixArray.length > 0 ? `${prefixArray.join('/')}/` : './';

    // 核心 babel 替换逻辑
    let {code} = babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-object-rest-spread'),
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-class-properties'),
            path.join(__dirname, 'node_modules', 'babel-plugin-syntax-jsx'),
            babel.createConfigItem(require('./plugin')(filename, prefix)),
        ]
    });

    // 未发生过中文替换时，不保存代码
    if(Object.getOwnPropertyNames(manager.cache[filename]).length === 0) return;
    // 根据文件名添加 import {getString} from './localize';
    if(path.extname(filename) === '.js') {
        code = `import {getString} from '${prefix}localize'\n` + code;
    }

    // ESLint 格式化
    const options = {
        text: code,
        eslintConfig: require('./eslintrc')
    };
    const formatted = format(options);

    // 保存代码
    fs.writeFile(filepath, formatted, err => err);
});

// 生成 localizations 多语言文件包（中文）
const localizationKeys = Object.getOwnPropertyNames(manager.cache);
const fileContent = {};
localizationKeys.forEach(key => {
    Object.assign(fileContent, manager.cache[key]);
});
fs.writeFile(path.join(currentDir, 'localizations', 'zh-CN.json'),
    JSON.stringify(fileContent, null, 4), err => err);

// 复制 copy 目录的文件到当前节点
fs.copyFile(path.join(__dirname, './copy/localize.js'), `${currentDir}/localize.js`);
