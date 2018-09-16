const babel = require("@babel/core");
const path = require('path');
const manager = require('./manager');
const fs = require('file-system');

const currentDir = process.cwd(); 

fs.recurseSync(currentDir, [
    '**/*.js',
    '**/*.jsx', 
], function(filepath, relative, filename) {  
    if (!filename) return;
    const prefixLength = filepath.replace(currentDir, '').split('/').filter(i => i).length;
    const prefixArray = [];
    for(let i = 0;i < prefixLength;i++) {
        prefixArray.push('..');
    }
    const prefix = prefixArray.length > 0 ? `${prefixArray.join('/')}/` : './';
    const {code} = babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            "syntax-jsx",
            babel.createConfigItem(require("./plugin")(filename, prefix)),
        ]
    });
    fs.writeFile(filepath, code, function(err) {})
});

// 生成 localizations 多语言文件包
const localizationKeys = Object.getOwnPropertyNames(manager.cache);
const componentKeys = localizationKeys.filter(i => i.includes('.jsx'));
const otherKeys = localizationKeys.filter(i => !i.includes('.jsx'));
// console.log(manager.cache, localizationKeys, componentKeys, otherKeys);

componentKeys.forEach(key => {
    // 生成各个组件对应的 json
    fs.writeFile(path.join(currentDir, 'localizations', key.replace('.jsx', '.json')), 
    JSON.stringify(manager.cache[key]), function(err) {})
});
const otherFileContent = {};
otherKeys.forEach(key => {
    Object.assign(otherFileContent, manager.cache[key]);
})
// 生成 Other.json
fs.writeFile(path.join(currentDir, 'localizations', 'Other.json'), 
    JSON.stringify(otherFileContent), function(err) {})