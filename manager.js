const utils = require('./utils');

const cache = {

};

function setCache(filename, chinese) {
    const cleanChinese = chinese.trim();
    for(const k in cache[filename]) {
        if(cache[filename][k] === cleanChinese)
          return k;
    }
    const keyPrefix = filename.split('.')[0];
    const key = `${keyPrefix.slice(0, 1).toLocaleLowerCase()}${keyPrefix.slice(1)}.${utils.guid()}`;
    // 缓存汉字
    cache[filename][key] = cleanChinese;
    return key;
} 

module.exports = {
    cache,
    setCache
}