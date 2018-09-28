#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('file-system');
const babel = require('@babel/core');
const manager = require("./manager");

const currentDir = process.cwd();

manager.cache = JSON.parse(fs.readFileSync(path.join(currentDir, 'localizations', 'zh-CN.json')));

fs.recurseSync(currentDir, [
    '**/*.js',
    '**/*.jsx',
], (filepath, relative, filename) => {
    if(!filename) return;

    // 核心 babel 检测
    let {code} = babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-object-rest-spread'),
            path.join(__dirname, 'node_modules', '@babel/plugin-syntax-class-properties'),
            path.join(__dirname, 'node_modules', 'babel-plugin-syntax-jsx'),
            babel.createConfigItem(require('./check-plugin')(filename, filepath)),
        ]
    });
});
