const manager = require('./manager');
const utils = require('./utils');
const TemplateLiteral = require('./visitor/TemplateLiteral');

const INTL = 'formatMessage';

const Literal = (t, filename) => path => {
  if(!utils.hasChinese(path.node.value)) return;
  let flag = false;
  path.findParent(path => {
    if(path.isProperty() && path.node.key.name === 'defaultMessage')
      flag = true;
  });
  if(flag) return;
  const chinese = path.node.value;
  const key = manager.setCache(path, filename, chinese);
  
  // 父节点是 import 语句时不做处理
  if(path.parent.type === 'ImportDeclaration') return;

  // 父节点是 JSX 属性时
  if(path.parent.type === 'JSXAttribute') {
    path.replaceWith(
        t.jSXExpressionContainer(
          utils.formatMessageT(t, key, chinese)
        )
    );
    return ;
  }

  path.replaceWith(utils.formatMessageT(t, key, chinese));
  return ;
}

const JSXText = (t, filename) => path => {
  const chinese = path.node.value;
  if(!utils.hasChinese(path.node.value)) return;
  const key = manager.setCache(path, filename, chinese);
  path.replaceWith(
    t.jSXExpressionContainer(utils.formatMessageT(t, key, chinese))
    );
  };

const ImportDeclaration = (t, filename, prefix) => path => {
  if (path.node.source.value === 'react') {
    // 在 import react 后添加 import intl
    path.insertAfter(
      t.importDeclaration([
        t.importSpecifier(t.identifier(INTL), t.identifier(INTL))
      ], t.stringLiteral(`${prefix}intl`))
    );
  }
}

module.exports = (filename, prefix) => function({ types: t }) {
    return {
      name: "intl-replace-plugin",
      visitor: {
        Literal: Literal(t, filename),
        JSXText: JSXText(t, filename),
        // 处理字符串模板
        TemplateLiteral: TemplateLiteral(t, filename),
        // 添加 import {intl} from '...';
        ImportDeclaration: ImportDeclaration(t, filename, prefix),
      }
  };
};