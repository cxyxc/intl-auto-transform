#!/usr/bin/env node
'use strict';

const fs = require('file-system');
const format = require("prettier-eslint");
const currentDir = process.cwd();

fs.recurseSync(currentDir, [
    '**/*.js',
    '**/*.jsx',
], (filepath, relative, filename) => {
    if(!filename) return;
    // ESLint 格式化
    const options = {
        text: fs.readFileSync(filepath).toString(),
        eslintConfig: require('./eslintrc')
    };
    const formatted = format(options);

    // 保存代码
    fs.writeFile(filepath, formatted, err => err);
});
