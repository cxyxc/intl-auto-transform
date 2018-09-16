const manager = require('./manager');
const utils = require('./utils');

function hasChinese(str) {
  return escape(str).indexOf('%u') !== -1
}

module.exports = filename => function({ types: t }) {
    manager.cache[filename] = {};
    return {
      name: "intl-replace-plugin",
      visitor: {
        Literal(path) {
          if(!hasChinese(path.node.value)) return;
          // 生成 guid
          const key = utils.guid();
          // 缓存汉字
          manager.cache[filename][key] = path.node.value;

          // 父节点是 JSX 属性时
          if(path.parent.type === 'JSXAttribute') {
            path.replaceWith(
                t.jSXExpressionContainer(
                  t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
                )
            );
            return ;
          }

          if(
            path.parent.type === 'ObjectProperty' ||
            path.parent.type === 'CallExpression' ||
            path.parent.type === 'VariableDeclarator'
          ) {
            path.replaceWith(t.callExpression(t.identifier('getString'), [t.stringLiteral(key)]));
            return ;
          }
        },
        // 处理字符串模板
        TemplateLiteral(path) {
          const {quasis: lastQuasis, expressions: lastExpressions} = path.node;
          
          let flag = true;
          lastQuasis.forEach(item => {
            if(hasChinese(item.value.raw))
              flag = false;
          });
          if(flag) return;

          const newQuasis = [];
          const newExpressions = [];

          const chineseQuasisIndex = [];
          const chineseQuasis = [];
          lastQuasis.forEach((item, index) => {
            if(hasChinese(item.value.raw)) {
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
            // 生成 guid
            const key = utils.guid();
            // 缓存汉字
            manager.cache[filename][key] = chineseQuasis.shift().value.raw;
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
        }
      }
  };
};