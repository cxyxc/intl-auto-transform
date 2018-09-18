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

function setCache(filename, chinese) {
    if(!cache[filename]) cache[filename] = {};
    const cleanChinese = chinese.trim();
    for(const k in cache[filename]) {
        if(cache[filename][k] === cleanChinese)
          return k;
    }
    const keyPrefix = filename.split('.')[0];

    // 根据 keyType 决定产出语言包的 key 值
    // TODO: 留待后续完善
    let id = '';
    switch(config.keyType) {
        case 'en':
            break;
    }

    const key = `${keyPrefix.slice(0, 1).toLocaleLowerCase()}${keyPrefix.slice(1)}.${utils.guid()}`;
    // 缓存汉字
    cache[filename][`${key}${id}`] = cleanChinese;
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