function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4());
}

// 是否包含中文
function hasChinese(str) {
    return escape(str).indexOf('%u') !== -1
}

// 是否是大写字母
function isBF(str) {
    return str >= 'A' && str <= 'Z'; 
}

module.exports = {
    guid,
    hasChinese,
    isBF
};