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
    const prefixLength = filepath.replace(currentDir, '').split('/').filter(i => i).length;
    const prefixArray = [];
    for(let i = 0; i < prefixLength; i++)
        prefixArray.push('..');
    
    const prefix = prefixArray.length > 0 ? `${prefixArray.join('/')}/` : './';
    const {code} = babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-object-rest-spread'),
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-class-properties'),
            path.join(__dirname, 'node_modules', 'babel-plugin-syntax-jsx'),
            babel.createConfigItem(require('./plugin')(filename, prefix)),
        ]
    });

    const options = {
        text: code,
        eslintConfig: require('./eslintrc'),
        prettierOptions: {
          bracketSpacing: true
        },
        fallbackPrettierOptions: {
          singleQuote: false
        }
    };
      
    const formatted = format(options);

    fs.writeFile(filepath, formatted, err => err);
});

// 生成 localizations 多语言文件包（中文）
const localizationKeys = Object.getOwnPropertyNames(manager.cache);
const componentKeys = localizationKeys.filter(i => i.includes('.jsx'));
const otherKeys = localizationKeys.filter(i => !i.includes('.jsx'));

componentKeys.forEach(key => {
    // 生成各个组件对应的 json
    fs.writeFile(path.join(currentDir, 'localizations', key.replace('.jsx', '.zh-CN.json')),
        JSON.stringify(manager.cache[key]), err => err);
});
const otherFileContent = {};
otherKeys.forEach(key => {
    Object.assign(otherFileContent, manager.cache[key]);
});
// 生成 Other.json
fs.writeFile(path.join(currentDir, 'localizations', 'Other.zh-CN.json'),
    JSON.stringify(otherFileContent), err => err);
