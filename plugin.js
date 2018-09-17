const manager = require('./manager');
const utils = require('./utils');
const TemplateLiteral = require('./visitor/TemplateLiteral');

const LOCALIZE = 'localize';

const Literal = ({t, filename}) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(filename, path.node.value);
  
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
}

const JSXText = ({t, filename}) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(filename, path.node.value);
    path.replaceWith(
      t.jSXExpressionContainer(
        t.callExpression(t.identifier('getString'), [t.stringLiteral(key)])
      )
  );
};

const Identifier = ({t, filename}) => path => {
  let flag = false;
  path.findParent(parentPath => {
    if(parentPath.isCallExpression() && parentPath.node.callee.name === LOCALIZE) {
      // 发现已添加 localize()
      flag = true; return;
    }
  });
  if(flag) return;
  if (path.node.name === filename.split('.')[0]) {
    path.findParent(parentPath => {
      if(parentPath.isExportDefaultDeclaration()) {
        // 对 export default 的组件进行 localize 包裹
        // 此处认为大写字母开头的为组件
        if(utils.isBF(path.node.name[0])) {
          path.replaceWith(
            t.callExpression(t.identifier(LOCALIZE), [path.node])
          );
        }
      }
    })

    return;
  }
};

const ImportDeclaration = ({t, filename, prefix}) => path => {
  if (path.node.source.value === 'react') {
    // 在 import react 后添加 import localize
    path.insertAfter(
      t.importDeclaration([
        t.importSpecifier(t.identifier(LOCALIZE), t.identifier(LOCALIZE))
      ], t.stringLiteral(`${prefix}${LOCALIZE}`))
    );
  }
}

module.exports = (filename, prefix) => function({ types: t }) {
    manager.cache[filename] = {};
    return {
      name: "intl-replace-plugin",
      visitor: {
        Literal: Literal({t, filename}),
        JSXText: JSXText({t, filename}),
        // 处理字符串模板
        TemplateLiteral: TemplateLiteral({t, filename}),
        // 获取到导出组件的语句
        Identifier: Identifier({t, filename}),
        ImportDeclaration: ImportDeclaration({t, filename, prefix}),
      }
  };
};