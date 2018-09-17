const utils = require('../utils');

const TemplateLiteral  = ({t, filename}) => path => {
    const {quasis: lastQuasis, expressions: lastExpressions} = path.node;

    let flag = true;
    lastQuasis.forEach(item => {
        if(utils.hasChinese(item.value.raw))
        flag = false;
    });
    if(flag) return;

    const newQuasis = [];
    const newExpressions = [];

    const chineseQuasisIndex = [];
    const chineseQuasis = [];
    lastQuasis.forEach((item, index) => {
        if(utils.hasChinese(item.value.raw)) {
        chineseQuasisIndex.push(index);
        chineseQuasis.push(item);
        newQuasis.push(
            t.templateElement({ raw: '', cooked: '' }, true)
        );
        // 不是第一个或最后一个时需要再加一个 templateElement 用作分隔
        // 是第一个或最后一个时需要再完成解析后再添加
        if(index !== 0 && index !== lastQuasis.length - 1)
            newQuasis.push(
            t.templateElement({ raw: '', cooked: '' }, true)
            );
        return;
        }
        newQuasis.push(item);
    });

    const generateExpressions = () => {
        const key = manager.setCache(filename, chineseQuasis.shift().value.raw);
        newExpressions.push(
        t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
        );
    };
    if(chineseQuasisIndex[0] === 0)
        generateExpressions()
    lastExpressions.forEach((item, index) => {
        newExpressions.push(item);
        if(chineseQuasisIndex.includes(index + 1))
        generateExpressions()
    });

    // 处理 第一个/最后一个 需要填充的分隔
    if(chineseQuasisIndex[0] === 0)
        newQuasis.unshift(t.templateElement({ raw: '', cooked: '' }, true));
    if(chineseQuasisIndex[chineseQuasisIndex.length - 1] === lastQuasis.length - 1)
        newQuasis.push(t.templateElement({ raw: '', cooked: '' }, true));

    path.replaceWith(t.templateLiteral(newQuasis, newExpressions));
    return ;
};

module.exports = TemplateLiteral;
