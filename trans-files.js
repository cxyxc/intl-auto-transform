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
    'localizations/*.zh-CN.json',
], (filepath, relative, filename) => {
    if(!filename) return;
    const key = filename.split('.')[0];
    manager.cache[key] = JSON.parse(fs.readFileSync(filepath));
});

const enCache = {};
fs.recurseSync(currentDir, [
    'localizations/*.en-US.json',
], (filepath, relative, filename) => {
    if(!filename) return;
    const key = filename.split('.')[0];
    enCache[key] = JSON.parse(fs.readFileSync(filepath));
});

// const arCache = {};
// fs.recurseSync(currentDir, [
//     'localizations/*.ar.json',
// ], (filepath, relative, filename) => {
//     if(!filename) return;
//     const key = filename.split('.')[0];
//     arCache[key] = JSON.parse(fs.readFileSync(filepath));
// });


// key 值调整
for(let filename in manager.cache) {
    for(let key in manager.cache[filename]) {
        const newKey = `${utils.toHump(filename)}.${utils.transformStr(key)}`;
        manager.cache[filename][newKey] = manager.cache[filename][key];
        enCache[filename][newKey] = enCache[filename][key];
        // arCache[filename][newKey] = arCache[filename][key];
        delete manager.cache[filename][key];
        delete enCache[filename][key];
        // delete arCache[filename][key];
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

function generateLocaleFile(cache, locale) {
    const localizationKeys = Object.getOwnPropertyNames(cache);
    const fileContent = {};
    localizationKeys.forEach(key => {
        Object.assign(fileContent, cache[key]);
    });
    fs.writeFile(path.join(currentDir, 'localizations', `${locale}.json`),
        JSON.stringify(fileContent, null, 4), err => err);       
}

// 生成 localizations 多语言文件包（中文）
if(manager.getCache().toString() !== '{}')
    generateLocaleFile(manager.getCache(), 'zh-CN')
// 英文
if(enCache.toString() !== '{}')
    generateLocaleFile(enCache, 'en-US');
// 阿拉伯语
// if(arCache.toString() !== '{}')
//     generateLocaleFile(arCache, 'ar');

// 复制 copy 目录的文件到当前节点
fs.copyFile(path.join(__dirname, './copy/localize.js'), `${currentDir}/localize.js`);
