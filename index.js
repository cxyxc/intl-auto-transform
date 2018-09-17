#!/usr/bin/env node
'use strict';

const babel = require('@babel/core');
const path = require('path');
const manager = require('./manager');
const fs = require('file-system');
const CLIEngine = require('eslint').CLIEngine;

const currentDir = process.cwd();

// 获取 ESLint 配置
const cli = new CLIEngine({
    envs: ['browser', 'mocha'],
    useEslintrc: false,
    rules: require('./eslintrc')
});

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
            '@babel/plugin-syntax-object-rest-spread',
            '@babel/plugin-syntax-class-properties',
            'syntax-jsx',
            babel.createConfigItem(require('./plugin')(filename, prefix)),
        ]
    });
    fs.writeFile(filepath, code, err => err);
});

// lint myfile.js and all files in lib/
const report = cli.executeOnFiles([currentDir]);

// output fixes to disk
CLIEngine.outputFixes(report);

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
