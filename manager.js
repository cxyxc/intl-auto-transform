const utils = require('./utils');

const cache = {

};

function setCache(filename, chinese) {
    const cleanChinese = chinese.trim();
    for(const k in cache[filename]) {
        if(cache[filename][k] === cleanChinese)
          return k;
    }
    const key = `${filename.split('.')[0]}.${utils.guid()}`;
    // 缓存汉字
    cache[filename][key] = cleanChinese;
    return key;
} 

module.exports = {
    cache,
    setCache
}