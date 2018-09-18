const utils = require('./utils');

const config = {
    keyType: '', // 默认情况下 key 与代码中的 getString 参数一致
};

const cache = {
    // babel 运行时中文字符缓存
};

function init({keyType}) {
    config.keyType = keyType;
}

function getKey(path) {
    const keyArray = [];
    // 根据 babel path 进行 key 值推算
    path.findParent(parentPath => {
        if(keyArray.length >= 2) return; 
        // 1. JSX 当中的字符
        if(parentPath.isJSXElement()) {
            const key = parentPath.node.openingElement.name.name;
            if(key && utils.isBF(key[0]))
                keyArray.unshift(utils.toHump(key));
        }
        // 2. TODO: antd 表格配置项
        if(parentPath.isVariableDeclarator() &&
            keyArray.length === 0 &&
            path.node.type === 'ObjectProperty'
        ) {
            keyArray.push(parentPath.node.id.name);
            if(path.inList) {
                path.container.forEach(element => {
                    if(element.type === 'ObjectProperty' && element.key.name === 'dataIndex') {
                        keyArray.push(element.value.value);
                    }
                });
            }
        }
    });

    return keyArray.join('.');
}

function setCache(path, filename, chinese) {
    if(!cache[filename]) cache[filename] = {};
    const cleanChinese = chinese.trim();
    for(const k in cache[filename]) {
        if(cache[filename][k] === cleanChinese)
          return k;
    }
    
    // 根据 keyType 决定产出语言包的 key 值
    // TODO: 留待后续完善
    const filenameKey = utils.toHump(filename.split('.')[0]);
    const autoSearchKey = getKey(path);
    const guid = utils.guid();
    let keyArray = [];
    switch(config.keyType) {
        case 'auto':
            keyArray = [
                filenameKey,
                autoSearchKey,
                guid
            ];
            break;
        default :
            keyArray = [
                filenameKey,
                guid
            ];
            break;
    }
    const key = keyArray.filter(i => i).join('.');
    // 缓存汉字
    cache[filename][key] = cleanChinese;
    return key;
}

function getCache(filename) {
    if(filename) return cache[filename] || {};
    return cache;
}

module.exports = {
    init,
    cache,
    setCache,
    getCache,
}
