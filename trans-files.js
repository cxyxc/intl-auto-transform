#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('file-system');
const babel = require('@babel/core');
const manager = require("./manager");
const utils = require("./utils");
const format = require("prettier-eslint");

const currentDir = process.cwd();

fs.recurseSync(currentDir, [
    'localizations/*.json',
], (filepath, relative, filename) => {
    if(!filename) return;
    const key = filename.split('.')[0];
    manager.cache[key] = JSON.parse(fs.readFileSync(filepath));
});

// key 值调整
for(let filename in manager.cache) {
    for(let key in manager.cache[filename]) {
        const newKey = `${utils.toHump(filename)}.${utils.transformStr(key)}`;
        manager.cache[filename][newKey] = manager.cache[filename][key];
        delete manager.cache[filename][key];
    }
}

fs.recurseSync(currentDir, [
    '**/*.js',
    '**/*.jsx',
], (filepath, relative, filename) => {
    if(!filename) return;

    // 核心 babel 替换逻辑
    let {code} = babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-object-rest-spread'),
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-class-properties'),
            path.join(__dirname, 'node_modules', 'babel-plugin-syntax-jsx'),
            babel.createConfigItem(require('./trans-plugin')(filename)),
        ]
    });

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
const localizationKeys = Object.getOwnPropertyNames(manager.getCache());
const fileContent = {};
localizationKeys.forEach(key => {
    Object.assign(fileContent, manager.getCache(key));
});
fs.writeFile(path.join(currentDir, 'localizations', 'zh-CN.json'),
    JSON.stringify(fileContent, null, 4), err => err);