#!/usr/bin/env node
'use strict';

const babel = require('@babel/core');
const path = require('path');
const fs = require('file-system');
const format = require("prettier-eslint");
const currentDir = process.cwd();

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
