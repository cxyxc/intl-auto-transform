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
        // Literal(path) {
        //   if(!hasChinese(path.node.value)) return;
        //   // 生成 guid
        //   const key = utils.guid();
        //   // 缓存汉字
        //   manager.cache[filename][key] = path.node.value.value;

        //   // 父节点是 JSX 属性时
        //   if(path.parent.type === 'JSXAttribute') {
        //     path.replaceWith(
        //         t.jSXExpressionContainer(
        //           t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
        //         )
        //     );
        //     return ;
        //   }

        //   if(
        //     path.parent.type === 'ObjectProperty' ||
        //     path.parent.type === 'CallExpression' ||
        //     path.parent.type === 'VariableDeclarator'
        //   ) {
        //     path.replaceWith(t.callExpression(t.identifier('getString'), [t.stringLiteral(key)]));
        //     return ;
        //   }

        //   if(path.node.value === '性别')
        //     console.log(path.parent.type);
        // },
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
              newQuasis.push(
                t.templateElement({ raw: '', cooked: '' }, true)
              );
              return;
            }
            newQuasis.push(item);
          });

          lastExpressions.forEach((item, index) => {
            if(chineseQuasisIndex.includes(index + 1)) {
              // 生成 guid
              const key = utils.guid();
              // 缓存汉字
              manager.cache[filename][key] = chineseQuasis[index].value.raw;
              newExpressions.push(
                t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
              );
              return;
            }
            newExpressions.push(item);
          });

          console.log(newQuasis, newExpressions);
          // const newQuasis = [
          //   t.templateElement({ raw: 'foo', cooked: 'foo' }, true),
          //   t.templateElement({ raw: 'foo', cooked: 'foo' }, true),
          //   t.templateElement({ raw: 'foo', cooked: 'foo' }, true),
          //   t.templateElement({ raw: 'foo', cooked: 'foo' }, true),
          // ];
          // const newExpressions = [
          //   t.identifier('A'),
          //   t.identifier('B'),
          //   t.identifier('C')
          // ];
          path.replaceWith(t.templateLiteral(newQuasis, newExpressions));
          return ;
        }
        // TemplateElement(path) {
        //   if(!hasChinese(path.node.value.raw)) return;
        //   const key = utils.guid();
        //   // 缓存汉字
        //   manager.cache[filename][key] = path.node.value.raw;
        //   path.replaceWith(
        //     t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
        //   );
        // }
      }
    };
  };